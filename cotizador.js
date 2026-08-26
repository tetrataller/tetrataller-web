const quoteForm = document.querySelector("#quote-form");

if (quoteForm) {
  const fileInput = document.querySelector("#model-file");
  const materialInput = document.querySelector("#quote-material");
  const quantityInput = document.querySelector("#quote-quantity");
  const colorsInput = document.querySelector("#quote-colors");
  const palette = document.querySelector("#color-palette");
  const analysisPanel = document.querySelector("#model-analysis");
  const scalePanel = document.querySelector("#scale-panel");
  const scaleInput = document.querySelector("#quote-scale");
  const scaleValue = document.querySelector("#scale-value");
  const detectedDimensions = document.querySelector("#detected-dimensions");
  const scaledDimensions = document.querySelector("#scaled-dimensions");
  const modelSummary = document.querySelector("#model-summary");
  const canvas = document.querySelector("#model-preview");
  const error = document.querySelector("#quote-error");
  const result = document.querySelector("#quote-result");
  const price = document.querySelector("#quote-price");
  const whatsapp = document.querySelector("#quote-whatsapp");

  let model = null;
  let rotationX = -0.35;
  let rotationY = 0.65;
  let dragging = false;
  let pointer = { x: 0, y: 0 };

  // Parámetros internos editables. El resultado es orientativo, no una venta automática.
  const rates = {
    weightCalibration: 0.73,
    plaAllInCostPerGram: 0.397,
    petgAllInCostPerGram: 0.455,
    profitMultiplier: 3,
    extraColorFactor: 0.12,
  };

  const hideMessages = () => {
    error.hidden = true;
    result.hidden = true;
  };

  const reject = (message) => {
    error.textContent = message;
    error.hidden = false;
    result.hidden = true;
  };

  const formatDimensions = (dimensions) => dimensions.map((value) => {
    const rounded = Math.round(value * 10) / 10;
    return Number.isInteger(rounded) ? rounded : rounded.toFixed(1);
  }).join(" × ") + " mm";

  const selectedColors = () => [...palette.querySelectorAll("input:checked")];

  const triangleMetrics = (a, b, c) => {
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const cross = [
      ab[1] * ac[2] - ab[2] * ac[1],
      ab[2] * ac[0] - ab[0] * ac[2],
      ab[0] * ac[1] - ab[1] * ac[0],
    ];
    const area = Math.hypot(...cross) / 2;
    const volume = (
      a[0] * (b[1] * c[2] - b[2] * c[1])
      - a[1] * (b[0] * c[2] - b[2] * c[0])
      + a[2] * (b[0] * c[1] - b[1] * c[0])
    ) / 6;
    return { area, volume };
  };

  const finishGeometry = (vertices, triangles, unitScale = 1) => {
    if (!vertices.length || !triangles.length || triangles.length > 600000) {
      throw new Error("geometry");
    }

    const scaledVertices = vertices.map(([x, y, z]) => [x * unitScale, y * unitScale, z * unitScale]);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    let surfaceArea = 0;
    let signedVolume = 0;

    scaledVertices.forEach((vertex) => vertex.forEach((value, axis) => {
      if (!Number.isFinite(value)) throw new Error("geometry");
      min[axis] = Math.min(min[axis], value);
      max[axis] = Math.max(max[axis], value);
    }));

    triangles.forEach(([ia, ib, ic]) => {
      const a = scaledVertices[ia];
      const b = scaledVertices[ib];
      const c = scaledVertices[ic];
      if (!a || !b || !c) throw new Error("geometry");
      const metrics = triangleMetrics(a, b, c);
      surfaceArea += metrics.area;
      signedVolume += metrics.volume;
    });

    const dimensions = max.map((value, axis) => value - min[axis]);
    if (dimensions.some((value) => !Number.isFinite(value) || value <= 0) || surfaceArea <= 0) {
      throw new Error("geometry");
    }

    return {
      vertices: scaledVertices,
      triangles,
      dimensions,
      surfaceArea,
      volume: Math.abs(signedVolume),
    };
  };

  const parseBinaryStl = (buffer) => {
    const view = new DataView(buffer);
    const count = view.getUint32(80, true);
    if (84 + count * 50 !== buffer.byteLength) throw new Error("not-binary");
    const vertices = [];
    const triangles = [];
    let offset = 84;
    for (let triangle = 0; triangle < count; triangle += 1) {
      offset += 12;
      const indices = [];
      for (let corner = 0; corner < 3; corner += 1) {
        const index = vertices.length;
        vertices.push([
          view.getFloat32(offset, true),
          view.getFloat32(offset + 4, true),
          view.getFloat32(offset + 8, true),
        ]);
        indices.push(index);
        offset += 12;
      }
      triangles.push(indices);
      offset += 2;
    }
    return finishGeometry(vertices, triangles);
  };

  const parseAsciiStl = (buffer) => {
    const text = new TextDecoder().decode(buffer);
    const matches = [...text.matchAll(/vertex\s+([-+\deE.]+)\s+([-+\deE.]+)\s+([-+\deE.]+)/gi)];
    if (matches.length < 3 || matches.length % 3 !== 0) throw new Error("geometry");
    const vertices = matches.map((match) => [Number(match[1]), Number(match[2]), Number(match[3])]);
    const triangles = [];
    for (let index = 0; index < vertices.length; index += 3) triangles.push([index, index + 1, index + 2]);
    return finishGeometry(vertices, triangles);
  };

  const parseStl = (buffer) => {
    try {
      return parseBinaryStl(buffer);
    } catch (exception) {
      if (exception.message !== "not-binary") throw exception;
      return parseAsciiStl(buffer);
    }
  };

  const unzipModelXmls = async (buffer) => {
    const view = new DataView(buffer);
    let eocd = -1;
    for (let offset = Math.max(0, buffer.byteLength - 65557); offset <= buffer.byteLength - 22; offset += 1) {
      if (view.getUint32(offset, true) === 0x06054b50) eocd = offset;
    }
    if (eocd < 0) throw new Error("zip");

    const entries = view.getUint16(eocd + 10, true);
    let cursor = view.getUint32(eocd + 16, true);
    const modelEntries = [];
    for (let index = 0; index < entries; index += 1) {
      if (view.getUint32(cursor, true) !== 0x02014b50) throw new Error("zip");
      const method = view.getUint16(cursor + 10, true);
      const compressedSize = view.getUint32(cursor + 20, true);
      const nameLength = view.getUint16(cursor + 28, true);
      const extraLength = view.getUint16(cursor + 30, true);
      const commentLength = view.getUint16(cursor + 32, true);
      const localOffset = view.getUint32(cursor + 42, true);
      const name = new TextDecoder().decode(new Uint8Array(buffer, cursor + 46, nameLength));

      if (name.toLowerCase().endsWith(".model")) {
        modelEntries.push({ method, compressedSize, localOffset });
      }
      cursor += 46 + nameLength + extraLength + commentLength;
    }

    const models = [];
    for (const entry of modelEntries) {
      if (view.getUint32(entry.localOffset, true) !== 0x04034b50) throw new Error("zip");
      const localNameLength = view.getUint16(entry.localOffset + 26, true);
      const localExtraLength = view.getUint16(entry.localOffset + 28, true);
      const start = entry.localOffset + 30 + localNameLength + localExtraLength;
      const compressed = new Uint8Array(buffer.slice(start, start + entry.compressedSize));
      let xml;
      if (entry.method === 0) xml = new TextDecoder().decode(compressed);
      else {
        if (entry.method !== 8 || typeof DecompressionStream === "undefined") throw new Error("zip");
        const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
        xml = new TextDecoder().decode(await new Response(stream).arrayBuffer());
      }
      if (/<mesh[\s>]/i.test(xml)) models.push(xml);
    }
    if (!models.length) throw new Error("zip");
    return models;
  };

  const parse3mf = async (buffer) => {
    const xmlModels = await unzipModelXmls(buffer);
    const vertices = [];
    const triangles = [];
    xmlModels.forEach((xml) => {
      const documentModel = new DOMParser().parseFromString(xml, "application/xml");
      if (documentModel.querySelector("parsererror")) throw new Error("geometry");
      const unit = (documentModel.documentElement.getAttribute("unit") || "millimeter").toLowerCase();
      const unitScale = { micron: 0.001, millimeter: 1, centimeter: 10, inch: 25.4, foot: 304.8, meter: 1000 }[unit] || 1;
      [...documentModel.querySelectorAll("mesh")].forEach((mesh) => {
        const offset = vertices.length;
        [...mesh.querySelectorAll("vertices > vertex")].forEach((vertex) => {
          vertices.push([
            Number(vertex.getAttribute("x")) * unitScale,
            Number(vertex.getAttribute("y")) * unitScale,
            Number(vertex.getAttribute("z")) * unitScale,
          ]);
        });
        [...mesh.querySelectorAll("triangles > triangle")].forEach((triangle) => {
          triangles.push([
            offset + Number(triangle.getAttribute("v1")),
            offset + Number(triangle.getAttribute("v2")),
            offset + Number(triangle.getAttribute("v3")),
          ]);
        });
      });
    });
    return finishGeometry(vertices, triangles);
  };

  const rotateVertex = ([x, y, z], center) => {
    const px = x - center[0];
    const py = y - center[1];
    const pz = z - center[2];
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const x1 = px * cosY + pz * sinY;
    const z1 = -px * sinY + pz * cosY;
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    return [x1, py * cosX - z1 * sinX, py * sinX + z1 * cosX];
  };

  const renderPreview = () => {
    if (!model) return;
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#262320");
    gradient.addColorStop(1, "#151311");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const center = model.dimensions.map((dimension, axis) => model.min[axis] + dimension / 2);
    const projected = model.vertices.map((vertex) => rotateVertex(vertex, center));
    const extent = Math.max(...model.dimensions);
    const zoom = Math.min(width, height) * 0.72 / extent;
    const step = Math.max(1, Math.ceil(model.triangles.length / 9000));
    const faces = [];

    for (let index = 0; index < model.triangles.length; index += step) {
      const triangle = model.triangles[index];
      const points = triangle.map((vertexIndex) => projected[vertexIndex]);
      const ab = [points[1][0] - points[0][0], points[1][1] - points[0][1], points[1][2] - points[0][2]];
      const ac = [points[2][0] - points[0][0], points[2][1] - points[0][1], points[2][2] - points[0][2]];
      const normal = [
        ab[1] * ac[2] - ab[2] * ac[1],
        ab[2] * ac[0] - ab[0] * ac[2],
        ab[0] * ac[1] - ab[1] * ac[0],
      ];
      const length = Math.hypot(...normal) || 1;
      const light = Math.max(0.18, Math.min(1, 0.46 + (normal[0] * -0.25 + normal[1] * -0.45 + normal[2] * 0.75) / length * 0.54));
      faces.push({ points, depth: points.reduce((sum, point) => sum + point[2], 0) / 3, light });
    }

    faces.sort((a, b) => a.depth - b.depth).forEach((face) => {
      context.beginPath();
      face.points.forEach((point, index) => {
        const x = width / 2 + point[0] * zoom;
        const y = height / 2 - point[1] * zoom;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      const red = Math.round(189 * face.light);
      const green = Math.round(69 * face.light);
      const blue = Math.round(56 * face.light);
      context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      context.fill();
      context.strokeStyle = "rgba(248,245,239,0.08)";
      context.stroke();
    });
  };

  const currentScale = () => Number(scaleInput.value) / 100;
  const currentDimensions = () => model.dimensions.map((value) => value * currentScale());

  const updateScale = () => {
    if (!model) return;
    scaleValue.textContent = `${scaleInput.value} %`;
    scaledDimensions.textContent = formatDimensions(currentDimensions());
    hideMessages();
  };

  fileInput.addEventListener("change", async () => {
    hideMessages();
    model = null;
    analysisPanel.hidden = true;
    scalePanel.hidden = true;
    const file = fileInput.files[0];
    if (!file) return;
    const extension = file.name.split(".").pop().toLowerCase();
    if (!["stl", "3mf"].includes(extension) || file.size > 25 * 1024 * 1024) {
      reject("Este archivo no es compatible con la cotización automática. Por sus características, no podemos procesarlo mediante este servicio.");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const geometry = extension === "stl" ? parseStl(buffer) : await parse3mf(buffer);
      const min = [Infinity, Infinity, Infinity];
      geometry.vertices.forEach((vertex) => vertex.forEach((value, axis) => { min[axis] = Math.min(min[axis], value); }));
      model = { ...geometry, min };
      scaleInput.value = "100";
      detectedDimensions.textContent = formatDimensions(model.dimensions);
      modelSummary.textContent = `${model.triangles.length.toLocaleString("es-MX")} triángulos · escala interpretada en milímetros`;
      analysisPanel.hidden = false;
      scalePanel.hidden = false;
      updateScale();
      renderPreview();
    } catch (exception) {
      reject("Este archivo no es compatible con la cotización automática. Por sus características, no podemos procesarlo mediante este servicio.");
    }
  });

  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    pointer = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    rotationY += (event.clientX - pointer.x) * 0.012;
    rotationX += (event.clientY - pointer.y) * 0.012;
    pointer = { x: event.clientX, y: event.clientY };
    renderPreview();
  });
  canvas.addEventListener("pointerup", () => { dragging = false; });
  canvas.addEventListener("pointercancel", () => { dragging = false; });

  palette.addEventListener("change", (event) => {
    const allowed = Number(colorsInput.value);
    const checked = selectedColors();
    if (checked.length > allowed) event.target.checked = false;
    hideMessages();
  });

  colorsInput.addEventListener("change", () => {
    selectedColors().slice(Number(colorsInput.value)).forEach((input) => { input.checked = false; });
    hideMessages();
  });

  scaleInput.addEventListener("input", updateScale);
  quoteForm.addEventListener("input", (event) => {
    if (event.target !== fileInput && event.target !== scaleInput) hideMessages();
  });

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hideMessages();
    const quantity = Number(quantityInput.value);
    const colorCount = Number(colorsInput.value);

    if (!model || !quantity) {
      reject("Carga un archivo compatible y completa las opciones para calcular el estimado.");
      return;
    }

    const dimensions = currentDimensions();
    if (dimensions[0] > 330 || dimensions[1] > 320 || dimensions[2] > 325) {
      reject("Este archivo no es compatible con la cotización automática. Por sus características, no podemos procesarlo mediante este servicio.");
      return;
    }

    if (selectedColors().length !== colorCount) {
      reject(`Selecciona ${colorCount} ${colorCount === 1 ? "color" : "colores"} para continuar.`);
      return;
    }

    const scale = currentScale();
    const surfaceCm2 = model.surfaceArea * scale ** 2 / 100;
    const enclosedVolumeCm3 = model.volume * scale ** 3 / 1000;
    const materialVolumeCm3 = Math.max(6, Math.min(enclosedVolumeCm3, surfaceCm2 * 0.12 + enclosedVolumeCm3 * 0.15));
    const density = materialInput.value === "petg" ? 1.27 : 1.24;
    const estimatedGrams = materialVolumeCm3 * density * rates.weightCalibration;
    const allInCostPerGram = materialInput.value === "petg" ? rates.petgAllInCostPerGram : rates.plaAllInCostPerGram;
    const colorFactor = 1 + (colorCount - 1) * rates.extraColorFactor;
    const estimatedCost = estimatedGrams * allInCostPerGram * quantity * colorFactor;
    const estimate = estimatedCost * rates.profitMultiplier;
    const roundedEstimate = Math.ceil(estimate / 5) * 5;

    price.textContent = `$${roundedEstimate.toLocaleString("es-MX")} MXN`;
    const chosenColors = selectedColors().map((input) => input.value).join(", ");
    const message = [
      "Hola, quiero solicitar la revisión de una impresión 3D.",
      "",
      `Archivo: ${fileInput.files[0].name}`,
      `Medidas: ${formatDimensions(dimensions)}`,
      `Escala: ${scaleInput.value} %`,
      `Material: ${materialInput.value.toUpperCase()}`,
      `Cantidad: ${quantity}`,
      `Colores: ${chosenColors}`,
      `Precio estimado: $${roundedEstimate.toLocaleString("es-MX")} MXN`,
      "",
      "Entiendo que el precio final y la viabilidad se confirman después de revisar el archivo.",
    ].join("\n");
    whatsapp.href = `https://wa.me/523345175877?text=${encodeURIComponent(message)}`;
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

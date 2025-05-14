async function initWebGPU() {
  if (!navigator.gpu) {
    throw new Error("WebGPU is not supported on this browser.");
  }

  const canvas = document.getElementById("webgpu-canvas") as HTMLCanvasElement;
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter?.requestDevice();

  const context = canvas.getContext("webgpu") as GPUCanvasContext;
  const format = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format,
    alphaMode: "opaque",
  });

  // Clear to dark gray
  const encoder = device.createCommandEncoder();
  const view = context.getCurrentTexture().createView();

  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view,
        clearValue: { r: 0.2, g: 0.2, b: 0.2, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });

  pass.end();
  device.queue.submit([encoder.finish()]);
}

initWebGPU().catch(console.error);

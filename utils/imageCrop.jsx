

export async function cropAndResizeImageFrontend(file, ratio = 16 / 9, outputWidth = 1280) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const inputWidth = img.width;
        const inputHeight = img.height;
        const inputRatio = inputWidth / inputHeight;

        // Hitung area crop
        let cropWidth = inputWidth;
        let cropHeight = inputHeight;

        if (inputRatio > ratio) {
          // terlalu lebar
          cropWidth = inputHeight * ratio;
        } else {
          // terlalu tinggi
          cropHeight = inputWidth / ratio;
        }

        const cropX = (inputWidth - cropWidth) / 2;
        const cropY = (inputHeight - cropHeight) / 2;

        const outputHeight = outputWidth / ratio;

        // Buat canvas
        const canvas = document.createElement("canvas");
        canvas.width = outputWidth;
        canvas.height = outputHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          outputWidth,
          outputHeight
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], file.name, { type: file.type });
            resolve(newFile);
          } else {
            reject("Gagal memproses gambar");
          }
        }, file.type);
      };
      img.onerror = reject;
      img.src = event.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

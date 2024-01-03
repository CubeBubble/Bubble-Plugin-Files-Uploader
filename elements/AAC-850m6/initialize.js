function(instance, context) {
  instance.data.uploadFile = async function (file) {
    let formData = new FormData();
    formData.append("file", file, file.name);
    const requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };
    const url = instance.data.websiteHomeUrl + "fileupload";

    try {
      const response = await fetch(url, requestOptions);
      const body = await response.text();
      const fileUrl = body.split('"')[1];
      return fileUrl;
    } catch (error) {
      throw error;
    }
  };

  instance.data.uploadFiles = async function (files) {
    try {
      const fileUrls = await Promise.all(
        files.map(async (file) => {
          return instance.data.uploadFile(file);
        })
      );
      instance.publishState("files", fileUrls);
    } catch (error) {
      throw error;
    } finally {
      instance.data.input.value = null;
      instance.data.uploadIsOnGoing = false;
      instance.publishState("isUploading", false);
      instance.triggerEvent("uploadEnd");
    }
  };

  const input = document.createElement("input");
  input.type = "file";
  input.style.cursor = "pointer";
  input.style.opacity = "0%";
  input.style.height = "100%";
  input.style.width = "100%";

  input.addEventListener("change", () => {
    if (!instance.data.uploadIsOnGoing) {
      instance.triggerEvent("uploadStart");
      instance.publishState("isUploading", true);
      instance.data.uploadIsOnGoing = true;
      const files = [...input.files];
      instance.data.uploadFiles(files);
    }
  });

  instance.canvas.appendChild(input);
  instance.data.input = input;
  instance.data.uploadIsOnGoing = false;
  instance.data.isInitialized = true;
}
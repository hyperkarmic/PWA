if (navigator.serviceWorker) {
  const onLoad = () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((register) => {
        console.log(`File registered ${register}`);
      })
      .catch((error) => {
        console.log(`Registeration failed ${error}`);
      });
  };
  window.addEventListener("load", onLoad);
}

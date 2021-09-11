type LogDestination = "console" | "server";
const logger =
  (destination: LogDestination) => (state) => (next) => (action) => {
    if (destination === "server") next(action);

    console.log("in logger");
    next(action);
  };

export default logger;

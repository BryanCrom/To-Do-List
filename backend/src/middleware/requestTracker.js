//example of custom middleware
function requestTracker(req, _, next) {
  console.log(`Req method is ${req.method} and Req URL is ${req.url}`);
  next();
}

export default requestTracker;

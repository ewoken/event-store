function serviceToRoute (serviceFunction) {
  return (req, res, next) => {
    return serviceFunction(req.body)
      .then(serviceResult => res.json(serviceResult))
      .catch(next)
  }
}

export default serviceToRoute

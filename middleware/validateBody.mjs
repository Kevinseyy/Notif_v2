export function validateBody(schema) {
  return function (req, res, next) {
    const errors = [];

    for (const key in schema) {
      const rules = schema[key];
      const value = req.body?.[key];

      if (rules.required && (value === undefined || value === null)) {
        errors.push({ field: key, error: "Field is required" });
        continue;
      }

      if (value === undefined || value === null) continue;

      if (rules.type === "string") {
        if (typeof value !== "string") {
          errors.push({ field: key, error: "Must be a string" });
          continue;
        }

        const trimmed = value.trim();

        if (rules.trim === true && trimmed.length === 0) {
          errors.push({ field: key, error: "Can not be empty" });
          continue;
        }

        if (rules.minLength && trimmed.length < rules.minLength) {
          errors.push({
            field: key,
            error: `Must be at least ${rules.minLength} characters`,
          });
        }

        if (rules.maxLength && trimmed.length > rules.maxLength) {
          errors.push({
            field: key,
            error: `Must be at most ${rules.maxLength} characters`,
          });
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    next();
  };
}

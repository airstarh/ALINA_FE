const text = (value) => value == null ? "" : String(value);

export function normalizeOptions(source = [], config = {}, path = "root") {
  const valueKey = config.valueKey || "id";
  const labelKey = config.labelKey || "option_value";
  const childrenKey = config.childrenKey || "options";

  return (Array.isArray(source) ? source : []).map((raw, index) => {
    const key = `${path}-${index}`;
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const hasOptionValue = Object.prototype.hasOwnProperty.call(raw, valueKey)
        || Object.prototype.hasOwnProperty.call(raw, "value");
      if (hasOptionValue) {
        const value = raw[valueKey] ?? raw.value;
        return { type: "option", key, value, label: text(raw[labelKey] ?? raw.label ?? raw.name ?? value), disabled: Boolean(raw.disabled), raw };
      }
      let children;
      let label;
      if (Array.isArray(raw[childrenKey])) {
        children = raw[childrenKey];
        label = raw.group ?? raw.label ?? raw.name ?? "";
      } else if (Array.isArray(raw.group)) {
        children = raw.group;
        label = raw.label ?? raw.name ?? "group";
      } else {
        const entry = Object.entries(raw).find(([, value]) => Array.isArray(value));
        if (entry) [label, children] = entry;
      }
      if (children) {
        return { type: "group", key, label: text(label), children: normalizeOptions(children, config, key), raw };
      }
      const value = raw[valueKey] ?? raw.value;
      return { type: "option", key, value, label: text(raw[labelKey] ?? raw.label ?? raw.name ?? value), disabled: Boolean(raw.disabled), raw };
    }
    return { type: "option", key, value: raw, label: text(raw), disabled: false, raw };
  });
}

export function filterOptionTree(tree, query = "") {
  const needle = text(query).trim().toLocaleLowerCase();
  if (!needle) return tree;
  return tree.flatMap((item) => {
    if (item.type === "option") return item.label.toLocaleLowerCase().includes(needle) ? [item] : [];
    const children = filterOptionTree(item.children, needle);
    return children.length ? [{ ...item, children }] : [];
  });
}

export function flattenOptionTree(tree, depth = 0) {
  return tree.flatMap((item) => item.type === "group"
    ? [{ ...item, depth }, ...flattenOptionTree(item.children, depth + 1)]
    : [{ ...item, depth }]);
}

import Select, { SelectOption } from "./Select";

interface SelectGroup {
  label: string;
  options: (SelectOption & { type?: "service" | "combo" })[];
}

interface GroupedSelectProps {
  groups: SelectGroup[];
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  multiple?: boolean;
  label?: string;
  closeOnSelect?: boolean;
  onAddNew?: () => void;
  disabled?: boolean;
}

const GroupedSelect = ({
  groups,
  value,
  onChange,
  multiple,
  ...props
}: GroupedSelectProps) => {
  // 🔹 Flatten options
  const flatOptions = groups.flatMap((group) => group.options);

  // 🔹 Add headings (disabled)
  const options: SelectOption[] = groups.flatMap((group) => [
    {
      value: `__heading_${group.label}`,
      label: group.label,
      disabled: true,
    },
    ...group.options,
  ]);

  // 🔹 Convert string IDs → option objects
  const handleChange = (val: string | string[]) => {
    if (!onChange) return;

    if (multiple && Array.isArray(val)) {
      const mapped = val
        .map((v) => flatOptions.find((opt) => opt.value === v))
        .filter(Boolean);

      onChange(mapped);
    } else {
      const selected = flatOptions.find((opt) => opt.value === val);
      onChange(selected ? [selected] : []);
    }
  };

  // 🔹 Convert object values → string IDs (for Select)
  const normalizedValue = multiple
    ? Array.isArray(value)
      ? value.map((v: any) => v.value)
      : []
    : (value?.value ?? "");

  return (
    <Select
      {...props}
      options={options}
      multiple={multiple}
      value={normalizedValue}
      onChange={handleChange}
    />
  );
};

export default GroupedSelect;

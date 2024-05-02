interface TextboxProps {
  label: string;
  value: string;
  setValue: (val: string) => void;
}

export default function Textbox(props: TextboxProps) {
  const { label, value, setValue } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="m-2">
      <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <div className="mt-2">
        <input
          name={label.toLowerCase()}
          value={value}
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}

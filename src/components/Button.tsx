import classNames from 'classnames';

export default function Button({
  disabled,
  label,
  onClick,
  className,
}: {
  disabled?: boolean;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <>
      {disabled ? (
        <button
          type="button"
          className={classNames(
            'inline-flex justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm',
            className,
          )}
          disabled
        >
          {label}
        </button>
      ) : (
        <button
          type="button"
          className={classNames(
            'inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
            className,
          )}
          onClick={onClick}
        >
          {label}
        </button>
      )}
    </>
  );
}

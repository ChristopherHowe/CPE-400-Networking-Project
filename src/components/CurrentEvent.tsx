import { XMarkIcon } from '@heroicons/react/24/outline';

export default function CurrentEvent({
  heading,
  message,
  dismissable,
  onDismiss,
}: {
  heading: string;
  message: string;
  dismissable?: boolean;
  onDismiss: () => void;
}) {
  return (
    <div className="w-full absolute bottom-0">
      <div className="m-4 p-3 bg-white shadow-lg ring-2 ring-gray-900/5 sm:rounded-xl">
        <div className="flex flex-row items-center">
          <div className="w-full flex flex-col items-center">
            <div className="xl:w-2/3">
              <h1 className="text-2xl">{heading}</h1>
              <p className="text-md">{message}</p>
            </div>
          </div>
          {dismissable && (
            <button onClick={onDismiss}>
              <XMarkIcon className="h-12 w-12 text-gray-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

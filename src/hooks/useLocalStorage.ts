import {useEffect, useState} from 'react';

export type Serializable =
  | void
  | null
  | string
  | number
  | boolean
  | Object
  | Array<any>;

export default function useLocalStorage<TValue extends Serializable>(
  name: string,
  defaultValue: TValue,
): [TValue, React.Dispatch<TValue>] {
  function getInitialValue() {
    const textValue = localStorage.getItem(name);
    return textValue ? JSON.parse(textValue) : defaultValue;
  }

  const [value, setValueInState] = useState<TValue>(getInitialValue);
  useEffect(() => {
    const serialized = JSON.stringify(value);
    if (serialized == null) {
      return;
    }

    localStorage.setItem(name, serialized);
  }, [name, value]);

  return [value, setValueInState];
}

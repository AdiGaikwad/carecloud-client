import React, { useState } from "react";
import { Input } from "./ui/input";

interface PatientIdInputProps {
  darkMode: boolean;
  onChange: (combinedValue: string) => void;
}

const PatientIdInput: React.FC<PatientIdInputProps> = ({ darkMode, onChange }) => {
  const [inputs, setInputs] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    inputName: string,
    maxLength: number,
    nextInputRef: React.RefObject<HTMLInputElement> | null,
    prevInputRef: React.RefObject<HTMLInputElement> | null
  ) => {
    const { value } = e.target;

    if (value.length <= maxLength) {
      const updatedInputs = {
        ...inputs,
        [inputName]: value.toUpperCase(),
      };
      setInputs(updatedInputs);

      // Call onChange with the combined value
      const combinedValue = Object.values(updatedInputs).join("");
      onChange(combinedValue);

      // Move to the next input if max length is reached
      if (value.length === maxLength && nextInputRef && nextInputRef.current) {
        nextInputRef.current.focus();
      }

      // Move to the previous input if cleared
      if (value.length === 0 && prevInputRef && prevInputRef.current) {
        prevInputRef.current.focus();
      }
    }
  };

  const input1Ref = React.useRef<HTMLInputElement>(null);
  const input2Ref = React.useRef<HTMLInputElement>(null);
  const input3Ref = React.useRef<HTMLInputElement>(null);
  const input4Ref = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2">
      <Input
        id="input1"
        type="text"
        maxLength={3}
        value={inputs.input1 || "CCH"}
        onChange={(e) =>
          handleInputChange(e, "input1", 3, input2Ref, null)
        }
        className={`${
          darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
        } p-2 rounded-md border`}
        ref={input1Ref}
        placeholder="CCH"
      />
      <Input
        id="input2"
        type="text"
        maxLength={4}
        value={inputs.input2}
        autoFocus
        onChange={(e) =>
          handleInputChange(e, "input2", 4, input3Ref, input1Ref)
        }
        className={`${
          darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
        } p-2 rounded-md border`}
        ref={input2Ref}
        placeholder="ABCD"
      />
      <Input
        id="input3"
        type="text"
        maxLength={4}
        value={inputs.input3}
        onChange={(e) =>
          handleInputChange(e, "input3", 4, input4Ref, input2Ref)
        }
        className={`${
          darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
        } p-2 rounded-md border`}
        ref={input3Ref}
        placeholder="EFGH"
      />
      <Input
        id="input4"
        type="text"
        maxLength={4}
        value={inputs.input4}
        onChange={(e) =>
          handleInputChange(e, "input4", 4, null, input3Ref)
        }
        className={`${
          darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
        } p-2 rounded-md border`}
        ref={input4Ref}
        placeholder="WXYZ"
      />
    </div>
  );
};

export default PatientIdInput;

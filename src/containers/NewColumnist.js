import React, { useRef, useState } from "react";
import FormColumnist from "../components/FormColumnist";
import { API } from "aws-amplify";
import config from "../config";
import "./NewColumnist.css";
import { s3Upload } from "../libs/awsLib";

export default function NewColumnist(props) {
  const file = useRef(null);
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("handleSubmit");

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than
        ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
      await createColumnist({ id, firstName, lastName, attachment });
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

  function createColumnist(columnist) {
    return API.post("columnist", "/columnist", {
      body: columnist,
    });
  }

  return (
    <FormColumnist
      handleSubmit={handleSubmit}
      id={id}
      setId={setId}
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      isLoading={isLoading}
      file={file}
      handleFileChange={handleFileChange}
    />
  );
}

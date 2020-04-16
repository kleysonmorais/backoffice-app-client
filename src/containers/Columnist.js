import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import config from "../config";
import "./Columnist.css";
import { s3Upload } from "../libs/awsLib";
import FormColumnist from "../components/FormColumnist";

export default function Columnist(props) {
  const file = useRef(null);
  const [columnist, setColumnist] = useState(null);
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadColumnist() {
      return API.get("columnist", `/columnist/${props.match.params.id}`);
    }

    async function onLoad() {
      try {
        const columnist = await loadColumnist();
        const { id, firstName, lastName, attachment } = columnist;
        if (attachment) {
          columnist.attachmentURL = await Storage.vault.get(attachment);
        }
        setId(id);
        setFirstName(firstName);
        setLastName(lastName);
        setColumnist(columnist);
      } catch (e) {
        alert(e);
      }
    }
    onLoad();
  }, [props.match.params.id]);

  async function handleSubmit(event) {
    let attachment;
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than
     ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`
      );
      return;
    }
    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
      await saveColumnist({
        id,
        firstName,
        lastName,
        attachment: attachment || columnist.attachment,
      });
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

  function saveColumnist(columnist) {
    return API.put("columnist", `/columnist/${props.match.params.id}`, {
      body: columnist,
    });
  }

  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      "Tem certeza que você quer remover este colunista?"
    );
    if (!confirmed) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteColumnist();
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsDeleting(false);
    }
  }

  function deleteColumnist() {
    return API.del("columnist", `/columnist/${props.match.params.id}`);
  }

  return (
    <>
      {columnist && (
        <FormColumnist
          handleSubmit={handleSubmit}
          id={id}
          setId={setId}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          isLoading={isLoading}
          isDeleting={isDeleting}
          handleDelete={handleDelete}
          file={file}
          columnist={columnist}
        />
      )}
    </>
  );
}

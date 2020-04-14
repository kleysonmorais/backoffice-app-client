import React, { useRef, useState, useEffect } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { API, Storage } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Columnist.css";
import { s3Upload } from "../libs/awsLib";

export default function Columnist(props) {

  const file = useRef(null);
  const [columnist, setColumnist] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadColumnist() {
      return API.get("columnist", `/columnist/${props.match.params.id}`);
    }

    async function onLoad() {
      try {
        const columnist = await loadColumnist();
        const { content, attachment } = columnist;
        if (attachment) {
          columnist.attachmentURL = await Storage.vault.get(attachment);
        }
        console.log(columnist);

        setContent(content);
        setColumnist(columnist);
      } catch (e) {
        alert(e);
      }
    }
    onLoad();
  }, [props.match.params.id]);

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    let attachment;
    event.preventDefault();
    if (file.current && file.current.size >
      config.MAX_ATTACHMENT_SIZE) {

      alert(
        `Please pick a file smaller than
     ${config.MAX_ATTACHMENT_SIZE /
        1000000} MB.`
      );
      return;
    }
    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
      await saveColumnist({
        content,
        attachment: attachment || columnist.attachment
      });
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

  function saveColumnist(columnist) {
    return API.put("columnist", `/columnist/${props.match.params.id}`, { body: columnist });
  }

  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm("Tem certeza que você quer remover este colunista?");
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
    <div className="Columnist">
      {columnist && (
        <form onSubmit={handleSubmit}>

          <FormGroup controlId="content">
            <FormControl value={content}
              componentClass="textarea"
              onChange={e => setContent(e.target.value)}
            />
          </FormGroup>

          {columnist.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={columnist.attachmentURL}
                >
                  {formatFilename(columnist.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}

          <FormGroup controlId="file">
            {!columnist.attachment && <ControlLabel>Attachment</ControlLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>

          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>

          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>

        </form>
      )}
    </div>
  );

}
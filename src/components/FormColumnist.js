import React from "react";
import { ButtonGroup, Form } from "react-bootstrap";
import LoaderButton from "./LoaderButton";
import { FaSave } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const FormColumnist = ({
  handleSubmit,
  id,
  setId,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  isLoading,
  handleDelete,
  isDeleting,
  file,
  handleFileChange,
}) => {
  const validateForm = () => {
    return id.length > 0 && firstName.length > 0 && lastName.length > 0;
  };

  return (
    <div className="Columnist container">
      <form onSubmit={handleSubmit}>
        <Form.Group controlId="id">
          <Form.Label>ID</Form.Label>
          <Form.Control
            type="number"
            value={id}
            onChange={(evt) => setId(evt.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="firstName">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(evt) => setFirstName(evt.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="lastName">
          <Form.Label>Sobrenome</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(evt) => setLastName(evt.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Foto de Capa</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <div className="text-right">
          <ButtonGroup aria-label="Basic example">
            <LoaderButton
              variant="primary"
              type="submit"
              isLoading={isLoading}
              disabled={!validateForm()}
            >
              <FaSave /> Salvar
            </LoaderButton>
            {handleDelete && (
              <LoaderButton
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                <MdDeleteForever /> Apagar
              </LoaderButton>
            )}
          </ButtonGroup>
        </div>
      </form>
    </div>
  );
};

export default FormColumnist;

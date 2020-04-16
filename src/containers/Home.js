import React, { useState, useEffect } from "react";
import { ListGroup, Row, Col, Card, Button } from "react-bootstrap";
import config from "../config";
import { LinkContainer } from "react-router-bootstrap";
import { API, Storage } from "aws-amplify";
import "./Home.css";

export default function Home(props) {
  const [columnists, setColumnists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }
      try {
        const columnists = await loadColumnists();
        for (let index = 0; index < columnists.length; index++) {
          const columnist = columnists[index];
          if (columnist.attachment) {
            columnist.attachmentUrl = await Storage.vault.get(
              columnist.attachment
            );
          }
        }
        setColumnists(columnists);
      } catch (e) {
        alert(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [props.isAuthenticated]);

  function loadColumnists() {
    return API.get("columnist", "/columnist");
  }

  function renderColumnistsList(columnists) {
    return (
      <Row>
        {columnists.map((columnist) => (
          <Col key={columnist.columnistId} xs={12} md={4}>
            <Card style={{ marginBottom: 15 }}>
              <div className="text-center">
                {columnist.attachmentUrl && (
                  <img
                    alt="Capa"
                    height="250"
                    className="img-capa"
                    variant="top"
                    src={columnist.attachmentUrl}
                  />
                )}
              </div>
              <Card.Body>
                <Card.Title>{`${columnist.firstName} ${columnist.lastName}`}</Card.Title>
                <Card.Text>{`ID: ${columnist.id}`}</Card.Text>
                <Card.Text>
                  {`Criado em: ${new Date(
                    columnist.createdAt
                  ).toLocaleString()}`}
                </Card.Text>
                <Card.Text>
                  {`Atualizado em:${new Date(
                    columnist.updatedAt
                  ).toLocaleString()}`}
                </Card.Text>
                <LinkContainer
                  key={columnist.columnistId}
                  to={`/columnists/${columnist.columnistId}`}
                >
                  <div className="text-right">
                    <Button variant="primary">Editar</Button>
                  </div>
                </LinkContainer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  function renderLander() {
    return (
      <div className="lander-main">
        <h1>App Total</h1>
        <p>Personalização de Telas</p>
        <LinkContainer to="/login">
          <Button variant="primary">Entrar</Button>
        </LinkContainer>
      </div>
    );
  }

  function renderColumnists() {
    return (
      <div className="container">
        <div className="row mt-5 mb-5">
          <div className="col-10 text-center">
            <h1 className="lander">Colunistas</h1>
            <LinkContainer to="/columnists/new">
              <Button type="button" variant="outline-dark">
                Adicionar
              </Button>
            </LinkContainer>
          </div>
          <div className="col-2 text-right">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${config.apiGateway.URL}/columnists`}
            >
              <Button type="button" variant="outline-success">
                API
              </Button>
            </a>
          </div>
        </div>
        <ListGroup>{!isLoading && renderColumnistsList(columnists)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderColumnists() : renderLander()}
    </div>
  );
}

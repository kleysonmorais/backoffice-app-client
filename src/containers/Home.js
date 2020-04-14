import React, { useState, useEffect } from "react";
import { ListGroup, Row, Col, Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import "./Home.css";

export default function Home(props) {
  const [columists, setColumists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }
      try {
        const columists = await loadColumnists();
        setColumists(columists);
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
        {
          columnists.map((columnist) =>
            (<Col key={columnist.columnistId} xs={12} md={4}>
              <Card style={{ marginBottom: 15 }}>
                <Card.Img variant="top" src="https://picsum.photos/300/200" />
                <Card.Body>
                  <Card.Title>{columnist.content.trim().split("\n")[0]}</Card.Title>
                  <Card.Text>
                    {"Criado em: " + new Date(columnist.createAt).toLocaleString()}
                  </Card.Text>
                  <LinkContainer key={columnist.columnistId} to={`/columnists/${columnist.columnistId}`}>
                    <Button variant="primary">Editar</Button>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>)
          )
        }
      </Row>
    );
  }

  function renderLander() {
    return (<div className="lander">
      <h1>App Total</h1>
      <p>Gerenciamento de Dados</p>
    </div>
    );
  }

  function renderColumnists() {
    return (
      <div className="container columists">
        <h1 className="lander">Colunistas</h1>
        <ListGroup>
          {!isLoading && renderColumnistsList(columists)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderColumnists() :
        renderLander()}
    </div>
  );
}
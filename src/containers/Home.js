import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
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
    return [{}].concat(columnists).map((columnist, i) =>
      i !== 0 ? (
        <LinkContainer key={columnist.columnistId} to=
          {`/columnists/${columnist.columnistId}`}>
          <ListGroupItem header={columnist.content.trim().split("\n")[0]}>
            {"Criado em: " + new Date(columnist.createAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
          <LinkContainer key="new" to="/columnists/new">
            <ListGroupItem>
              <h4><b>{"\uFF0B"}</b> Adicionar Colunista</h4>
            </ListGroupItem>
          </LinkContainer>
        )
    );
  }

  function renderLander() {
    return (<div className="lander">
      <h1>Scratch</h1>
      <p>A simple columists taking app</p>
    </div>
    );
  }

  function renderColumnists() {
    return (
      <div className="columists">
        <PageHeader>Colunistas</PageHeader>
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
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { listProducts } from "../api/fetchApi";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import CarouselComponent from "./CarouselComponent";

function Home() {
  const [products, setProduct] = useState([]);

  useEffect(() => {
    listProducts().then((res) => {
      setProduct(res.data);
    });
  }, []);

  return (
    <div>
      <CarouselComponent />
      <Container className="py-5">
        <h1 className="mb-4">Product Catalog</h1>
        <Row xs={1} md={2} lg={3} className="g-4">
          {products.length > 0 ? (
            products.map((prod) => (
              <Col key={prod.id}>
                <Link
                  to={`/product/${prod.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card className="card bg-light border-secondary mx-3 my-2 h-100 shadow-sm">
                    <div
                      className="position-relative"
                      style={{ paddingTop: "75%" }}
                    >
                      <Card.Img
                        variant="top"
                        src={prod.image}
                        alt={prod.product_name}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h5 mb-2">
                        {prod.product_name}
                      </Card.Title>
                      <Card.Text
                        className="text-muted mb-3"
                        style={{
                          fontSize: "0.9rem",
                          whiteSpace: "pre-wrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          marginBottom: "1rem",
                        }}
                      >
                        {prod.description}
                      </Card.Text>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="h5 mb-0">₹{prod.price}</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <h4>No Products</h4>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default Home;

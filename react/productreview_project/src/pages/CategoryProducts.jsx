import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listProductsByCategory } from "../api/fetchApi";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { toast } from "react-hot-toast";

function CategoryProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProductsByCategory(id)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products by category:", err);
        toast.error("Failed to load products.");
        setLoading(false);
      });
  }, [id]);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Products in this Category</h2>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : products.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {products.map((prod) => (
            <Col key={prod.id}>
              <Card
                className="bg-light border-secondary shadow-sm h-100"
                as={Link}
                to={`/product/${prod.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{ paddingTop: "75%", position: "relative" }}>
                  <Card.Img
                    src={`http://127.0.0.1:8000${prod.image}`}
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
                <Card.Body>
                  <Card.Title>{prod.product_name}</Card.Title>
                  <Card.Text
                    className="text-muted"
                    style={{
                      fontSize: "0.9rem",
                      WebkitLineClamp: 3,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {prod.description}
                  </Card.Text>
                  <div className="fw-bold">₹{prod.price}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <h5>No products available in this category.</h5>
      )}
    </Container>
  );
}

export default CategoryProducts;

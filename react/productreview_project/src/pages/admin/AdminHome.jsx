import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {
  listAdminProducts,
  deleteProduct,
  aiReviewAnalysis,
} from "../../api/fetchApi";
import { toast } from "react-hot-toast";
import { AdminContext } from "../../AdminContextApi";
import EditProduct from "./EditProduct";

function AdminHome() {
  const { adminProducts, setAdminProducts } = useContext(AdminContext);

  const [products, setProduct] = useState([]);

  const [selectedAIProduct, setSelectedAIProduct] = useState(null);
  const [aiText, setAiText] = useState("");

  const [loadingId, setLoadingId] = useState(null);

  const headers = {
    Authorization: `Token ${sessionStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    listAdminProducts(headers)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load products");
      });
  }, [adminProducts]);

  const delproduct = (id) => {
    deleteProduct(id, headers)
      .then((res) => {
        setAdminProducts(res);
        toast.success("Product Deleted!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error occurred!");
      });
  };

  const getAIReview = (id) => {
    setLoadingId(id);
    setSelectedAIProduct(id);
    setAiText("");

    aiReviewAnalysis(id, headers)
      .then((res) => {
        // If backend sends no reviews message
        if (res.data.message) {
          setAiText("No reviews yet");
        } else if (res.data.analysis) {
          setAiText(res.data.analysis);
          toast.success("AI Review Generated!");
        } else {
          setAiText("No reviews yet");
        }
      })
      .catch((err) => {
        console.log(err);

        // fallback if backend returns error
        if (err?.response?.data?.message) {
          setAiText("No reviews yet");
        } else {
          toast.error("AI analysis failed");
          setAiText("Unable to analyze now");
        }
      })
      .finally(() => {
        setLoadingId(null);
      });
  };

  const closeAI = () => {
    setSelectedAIProduct(null);
    setAiText("");
  };

  return (
    <div>
      <Container className="py-5">
        <h1 className="mb-4 fw-bold">Welcome, Admin!</h1>

        <Row xs={1} md={2} lg={3} className="g-4">
          {products.length > 0 ? (
            products.map((prod) => (
              <Col key={prod.id}>
                <Card className="bg-light border-secondary h-100 shadow-sm">
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
                    <Card.Title className="h5 mb-3">
                      {prod.product_name}
                    </Card.Title>

                    <Card.Text
                      className="text-muted"
                      style={{
                        fontSize: "0.9rem",
                        whiteSpace: "pre-wrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {prod.description}
                    </Card.Text>

                    <div className="mt-auto pt-3">
                      <h5 className="mb-3">₹{prod.price}</h5>

                      <div className="d-flex flex-wrap gap-2">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => delproduct(prod.id)}
                        >
                          Delete
                        </button>

                        <EditProduct id={prod.id} />

                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() => getAIReview(prod.id)}
                        >
                          {loadingId === prod.id
                            ? "Analyzing..."
                            : "AI Review"}
                        </button>
                      </div>

                      {selectedAIProduct === prod.id && aiText && (
                        <div className="mt-3 p-3 border rounded bg-white">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold text-success m-0">
                              AI Decision
                            </h6>

                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={closeAI}
                            >
                              Close
                            </button>
                          </div>

                          <pre
                            style={{
                              whiteSpace: "pre-wrap",
                              fontSize: "13px",
                              margin: 0,
                            }}
                          >
                            {aiText}
                          </pre>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
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

export default AdminHome;
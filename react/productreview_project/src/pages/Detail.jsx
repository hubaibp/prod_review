import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, getReviews, submitReview } from "../api/fetchApi";
import ProgressBar from "react-bootstrap/ProgressBar";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [relatedProduct, setRelatedProduct] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(2);

  const headers = {
    Authorization: `token ${sessionStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };

  const generateRandomId = () => {
    let randomId;
    do {
      randomId = Math.floor(Math.random() * (25 - 3 + 1)) + 3;
    } while (randomId === Number(id));
    return randomId;
  };

  useEffect(() => {
    setComment("");
    setRating(5);
    getProduct(id).then((res) => setProduct(res.data));

    getReviews(id)
      .then((res) => setReviews(res.data))
      .catch(() => toast.error("Failed to load reviews"));

    const fetchRelatedProduct = async () => {
      const randomId = generateRandomId();
      const res = await getProduct(randomId);
      setRelatedProduct(res.data);
    };

    fetchRelatedProduct();
  }, [id]);

  const handleSubmitReview = () => {
    if (!sessionStorage.getItem("token")) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    const reviewData = { rating, comment };

    submitReview(id, reviewData, headers)
      .then(() => {
        toast.success("Review submitted!");

        getReviews(id).then((res) => setReviews(res.data));
        getProduct(id).then((res) => setProduct(res.data));

        setComment("");
        setRating(5);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast.error(
            error.response.data.error || "You can only review a product once."
          );
        } else {
          toast.error("Failed to submit review");
        }
      });
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Img variant="top" src={product.image} />
          </Card>

          {/* Related Product Section (Under Image on Larger Screens) */}
          {relatedProduct && (
            <div className="mt-5 pt-4  d-md-block d-none">
              <h4>You may also like</h4>
              <div
                style={{
                  width: "350px",
                  borderBottom: "1px solid #ccc",
                  marginTop: "10px",
                }}
              ></div>
              <div className="d-flex mt-3">
                <Card style={{ width: "200px" }}>
                  <Card.Img
                    variant="top"
                    src={relatedProduct.image}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <h6>{relatedProduct.product_name}</h6>
                    <p>₹{relatedProduct.price}</p>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    >
                      View
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}
        </Col>

        <Col md={6}>
          <h1>{product.product_name}</h1>
          <pre
            className="text-muted mb-5"
            style={{
              fontSize: "0.9rem",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              marginBottom: "1rem",
              overflow: "visible",
            }}
          >
            {product.description}
          </pre>
          <h2 className="text-primary mb-4">₹{product.price}</h2>

          <h3 className="mt-5">Reviews</h3>
          <p>
            <strong>Average Rating:</strong> {product.avg_rating || 0.0}
          </p>

          <div className="review-form-box p-4 mt-3">
            <h4>Your Review</h4>
            <Form.Group>
              <Form.Label>Rating</Form.Label>
              <Form.Control
                as="select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>

            <Button className="mt-3 btn-sm" onClick={handleSubmitReview}>
              Submit
            </Button>
          </div>

          <h4 className="mt-4">All Reviews</h4>
          <hr />

          {reviews.length > 0 && (
            <div className="rating-breakdown mt-4">
              <h1 className="fw-bold">
                {product.avg_rating?.toFixed(1) || "0.0"}★
              </h1>
              <p>{reviews.length} Ratings & Reviews</p>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(
                  (rev) => rev.rating === star
                ).length;
                const percentage = (count / reviews.length) * 100;
                return (
                  <div key={star} className="d-flex align-items-center mb-2">
                    <div style={{ width: "40px" }}>
                      <strong>{star}★</strong>
                    </div>
                    <div style={{ flexGrow: 1, margin: "0 10px" }}>
                      <ProgressBar now={percentage} variant="warning" />
                    </div>
                    <div style={{ width: "60px", textAlign: "right" }}>
                      {count}
                    </div>
                  </div>
                );
              })}
              <hr />
            </div>
          )}

          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <div className="reviews-container">
              {reviews.slice(0, visibleReviews).map((review, index) => (
                <div key={review.id}>
                  <h5>{review.user}</h5>
                  <p>
                    <strong>Rating:</strong> {review.rating} ⭐
                  </p>
                  <p>{review.comment}</p>
                  {index !== visibleReviews - 1 &&
                    index !== reviews.length - 1 && <hr />}
                </div>
              ))}

              {reviews.length > visibleReviews && (
                <div className="mt-3">
                  <span
                    onClick={() => setVisibleReviews(reviews.length)}
                    style={{
                      color: "blue",
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    See all reviews
                  </span>
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>

      {/* Related Product ( Bottom on Smaller Screens,hidden on larger screens) */}
      {relatedProduct && (
        <div className="mt-5 pt-4 d-md-none">
          {" "}
          <h4>You may also like</h4>
          <hr />
          <div className="d-flex  mt-3">
            <Card style={{ width: "200px" }}>
              <Card.Img
                variant="top"
                src={relatedProduct.image}
                style={{ height: "150px", objectFit: "cover" }}
              />
              <Card.Body>
                <h6>{relatedProduct.product_name}</h6>
                <p>₹{relatedProduct.price}</p>
                <Button
                  size="sm"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  View
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Detail;

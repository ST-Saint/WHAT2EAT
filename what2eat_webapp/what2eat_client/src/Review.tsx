import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "./review.scss";
import { v4 as UUID } from "uuid";

type reviewForm = {
  reviewer: string;
  restaurant: string;
  dish: string;
  score: number;
  comment: string;
  date: Date;
};

interface reviewState {
  reviewer: string;
  restaurant: string;
  dish: string;
  score: number;
  comment: string;
  date: Date;
}

interface reviewProps {}

const Review = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<reviewForm>();
  const onSubmit: SubmitHandler<reviewForm> = async (review) => {
    review.date = new Date();
    let jsonRPCBody: any = {
      jsonrpc: "2.0",
      method: "add_review",
      params: { review: review },
      id: UUID(),
    };
    console.log(jsonRPCBody);
    const response = await fetch("http://localhost:8080", {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(jsonRPCBody),
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    });

    if (!response.ok) {
      /* Handle */
    }

    console.log(response.body);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}

      <label>Reviewer</label>
      <input
        placeholder="reviwer"
        {...register("reviewer", { required: true })}
      />
      <label>Restaurant</label>
      <input
        placeholder="restaurant"
        {...register("restaurant", { required: true })}
      />
      <label>dish</label>
      <input placeholder="dish" {...register("dish")} />
      <label>score</label>
      <input
        placeholder="score"
        {...register("score", {
          valueAsNumber: true,
          validate: (value) => {
            return value <= 100;
          },
          required: true,
        })}
      />
      <label>comment</label>
      <input
        placeholder="comment"
        {...register("comment")}
      />

      {errors.reviewer && <p>This field is required</p>}

      <input type="submit" />
    </form>
  );
};

class review extends React.Component<reviewProps, reviewState> {
  constructor(props: reviewProps) {
    super(props);
    this.state = {
      reviewer: "",
      restaurant: "",
      dish: "",
      score: 0,
      comment: "",
      date: new Date(),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // typing on RIGHT hand side of =
  onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ reviewer: e.currentTarget.value });
  };

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ reviewer: event.target.value });
  }

  handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    alert("A name was submitted: " + this.state);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.reviewer}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

// const Review = () => {
//   return (
//     <div className="review">
//       <form>
//         <label>
//           Name:
//           <input type="text" name="name" />
//         </label>
//         <input type="submit" value="Submit" />
//       </form>
//     </div>
//   );
// };

export default Review;

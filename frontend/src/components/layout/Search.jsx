import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Search() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword?.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate("/");
    }
  };

  useEffect(()=>{
     if(searchParams.has("keyword")){
      setKeyword(searchParams.get("keyword"))
     }
  }, [keyword, searchParams])

  return (
    <form
      onSubmit={submitHandler}
      action="your_search_action_url_here"
      method="get"
    >
      <div className="input-group">
        <input
          type="text"
          id="search_field"
          aria-describedby="search_btn"
          className="form-control"
          placeholder="Enter Product Name ..."
          name="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button id="search_btn" className="btn" type="submit">
          <i className="fa fa-search" aria-hidden="true"></i>
        </button>
      </div>
    </form>
  );
}

export default Search;

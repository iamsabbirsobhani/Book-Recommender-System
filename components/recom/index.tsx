'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function Recom() {
  const [recom, setRecom] = useState<any>(null);
  const [recomBooks, setRecomBooks] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState<boolean>(false);
  // Function to remove escape characters from values
  // Interface for the book data
  interface BookData {
    [key: string]: string;
  }

  // Function to remove escape characters from values
  function removeEscapeCharacters(obj: BookData): BookData {
    const cleanedObject: BookData = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Check if the value is a string before attempting to replace escape characters
        cleanedObject[key] =
          typeof obj[key] === 'string' ? obj[key].replace(/\\/g, '') : obj[key];
      }
    }
    return cleanedObject;
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);
      setIsLoading(true);
      const resRecommendation = await fetch(
        'https://book-recom.azurewebsites.net/recommend_and_predict',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: data.userId,
            isbn: data.isbn,
          }),
        },
      );

      const jsonRecommendation = await resRecommendation.json();

      // Clean the bookData object
      const cleanedBookData = removeEscapeCharacters(jsonRecommendation);

      setRecom(cleanedBookData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handlePredictRecomBooks = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);
      setIsLoadingBooks(true);
      const resRecommendation = await fetch(
        'https://book-recom.azurewebsites.net/recommend_and_predict',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: data.userId,
            isbn: '0446520802',
          }),
        },
      );

      const jsonRecommendation = await resRecommendation.json();

      // Clean the bookData object
      const cleanedBookData = removeEscapeCharacters(jsonRecommendation);

      setRecomBooks(cleanedBookData);
      setIsLoadingBooks(false);
    } catch (error) {
      setIsLoadingBooks(false);
      console.error(error);
    }
  };

  return (
    <>
      <div className="">
        <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl text-gray-50 text-center mt-[8vh]">
          Book Recommender System
        </h1>
      </div>

      <form
        onSubmit={handlePredictRecomBooks}
        className=" max-w-80 m-auto mt-[10vh]"
      >
        <div className=" mt-3">
          <input
            className=" border p-5 w-full text-white bg-gray-900"
            type="text"
            name="userId"
            placeholder="User Id (Integer)"
            inputMode="numeric"
            required
          />
        </div>
        <div className=" mt-3 w-full text-center mb-5">
          <button className=" border hover:bg-gray-200 active:bg-gray-400 duration-300 transition-all bg-gray-50 uppercase font-bold p-2  rounded-sm">
            Predict Recommend Books
          </button>
        </div>
        <div className=" mt-3 bg-blue-500 p-2 rounded-md text-white">
          <p>Enter USER ID to get the top-10 recommended books for the user.</p>
        </div>
      </form>
      <form onSubmit={handleSubmit} className=" max-w-80 m-auto mt-10">
        <div className=" border-dashed border mb-5 mt-5"></div>
        <div className="">
          <input
            className=" border p-5 w-full text-white bg-gray-900"
            type="text"
            name="userId"
            placeholder="User Id (Integer)"
            required
          />
        </div>
        <div className=" mt-5">
          <input
            className=" border p-5 w-full text-white bg-gray-900"
            type="text"
            name="isbn"
            placeholder="ISBN"
          />
        </div>
        <div className=" mt-3 mb-5 w-full text-center">
          <button className=" border hover:bg-gray-200 active:bg-gray-400 duration-300 transition-all bg-gray-50 uppercase font-bold p-2  rounded-sm">
            Predict Probable Ratings
          </button>
        </div>
        <div className=" mt-3 bg-blue-500 p-2 rounded-md text-white">
          <p>Enter User Id, ISBN and get the probable rating of that book.</p>
        </div>
      </form>
      <a
        className=" text-blue-500 underline  block text-center mt-3 mb-5 w-fit m-auto"
        target="_blank"
        href="https://www.kaggle.com/datasets/ruchi798/bookcrossing-dataset/data"
      >
        Dataset
      </a>

      {/* Output */}

      {/* predict recommended books */}
      {recomBooks && !isLoadingBooks ? (
        <div className=" fixed top-0 right-0 bottom-0 left-0 m-auto rounded-sm max-w-md bg-white overflow-y-auto h-[80vh] border p-5 break-words break-all">
          <div className=" flex justify-between">
            <h3 className=" font-bold text-3xl text-gray-700">Output: </h3>
            <div className=" bg-red-500 text-white p-3 rounded-md">
              <button onClick={() => setRecomBooks(null)}>Close</button>
            </div>
          </div>

          <div>
            {recomBooks && !recomBooks.error ? (
              <h1 className=" text-xl font-semibold mt-3">
                The top 10 recommendations for the user are as follows:
              </h1>
            ) : null}
            {recomBooks && !recomBooks.error ? (
              recomBooks.recommendations.map((book: any, index: number) => (
                <div
                  key={index}
                  className=" bg-gray-800 mt-3 mb-3 px-2 pb-2 text-white rounded-sm"
                >
                  <h1 className=" text-center bg-yellow-500 w-fit p-2 m-auto rounded-bl-md rounded-br-md text-gray-800 text-2xl">
                    {index + 1}
                  </h1>
                  <p className=" font-bold mt-3 text-xl">
                    {book['Book-Title']}
                  </p>
                  <p>ISBN: {book.ISBN}</p>
                  <p>Book Author: {book['Book-Author']}</p>
                  <p>Year Of Publication: {book['Year-Of-Publication']}</p>
                  <p>Book Publisher: {book.Publisher}</p>
                </div>
              ))
            ) : (
              <div className=" mt-3 text-white bg-red-500 rounded-md p-2">
                <p>{recomBooks.error}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div>
            {isLoadingBooks ? (
              <>
                <div className=" fixed w-full h-full backdrop-blur-md left-0 right-0 top-0 bottom-0 flex justify-center items-center">
                  <p className=" text-xl font-bold text-white">Predicting...</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* predict ratings */}
      {recom && !isLoading ? (
        <div className=" fixed top-0 right-0 bottom-0 left-0 m-auto rounded-sm max-w-md bg-white overflow-y-auto max-h-[45vh] border p-5 break-words break-all">
          <div className=" flex justify-between">
            <h3 className=" font-bold text-3xl text-gray-700">Output: </h3>
            <div className=" bg-red-500 text-white p-3 rounded-md">
              <button onClick={() => setRecom(null)}>Close</button>
            </div>
          </div>

          <div className="mt-10">
            {recom && !recom.error ? (
              <div className=" bg-gray-950 text-white p-5 mt-3 rounded-sm">
                <p className=" p-3">
                  Probable rating of the book by the user: <br />
                  <span className=" bg-yellow-950 py-3 px-2 w-fit rounded-md mt-2 block font-mono">
                    {' '}
                    {recom.predicted_rating}
                  </span>
                </p>
              </div>
            ) : (
              <div className=" mt-3 text-white bg-red-500 rounded-md p-2">
                <p>{recom.error}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div>
            {isLoading ? (
              <>
                <div className=" fixed w-full h-full backdrop-blur-md left-0 right-0 top-0 bottom-0 flex justify-center items-center">
                  <p className=" text-xl font-bold text-white">Predicting...</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      <footer>
        <div className=" flex justify-center items-center mt-[5vh]">
          <p className=" text-gray-400">Made with ❤️ by Sabbir Sobhani</p>
        </div>
      </footer>
    </>
  );
}

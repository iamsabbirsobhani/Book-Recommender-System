'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function Recom() {
  const [recom, setRecom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      console.log(data.userId, data.isbn);
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

      console.log(cleanedBookData);

      setRecom(cleanedBookData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="">
        <div className="">
          <input
            className=" border p-5"
            type="number"
            name="userId"
            placeholder="User Id"
            required
          />
        </div>
        <div className=" mt-5">
          <input
            className=" border p-5"
            type="text"
            name="isbn"
            placeholder="ISBN"
          />
        </div>
        <div className=" mt-3 w-full">
          <button className=" border p-5">Send</button>
        </div>
        <div className=" mt-3 bg-blue-500 p-2 rounded-md text-white">
          <p>Enter the User Id and ISBN to get the output</p>
        </div>
        <a
          className=" text-blue-500 underline mt-3"
          target="_blank"
          href="https://www.kaggle.com/datasets/ruchi798/bookcrossing-dataset/data"
        >
          Dataset
        </a>
      </form>

      {/* Output */}

      {recom && !isLoading ? (
        <div className=" fixed max-w-md bg-white overflow-y-auto h-[80vh] border p-5 break-words break-all">
          <div className=" flex justify-between">
            <h3 className=" font-bold text-3xl text-gray-700">Output: </h3>
            <div className=" bg-red-500 text-white p-3 rounded-md">
              <button onClick={() => setRecom(null)}>Close</button>
            </div>
          </div>

          <div>
            {recom && !recom.error ? (
              <div className=" bg-gray-950 text-white p-5 mt-3 rounded-sm">
                <p>
                  Probable rating of the book by the user:{' '}
                  <span className=" bg-yellow-950 p-2 rounded-md">
                    {' '}
                    {recom.predicted_rating}
                  </span>
                </p>
              </div>
            ) : null}
            {recom && !recom.error ? (
              <h1 className=" text-xl font-semibold mt-3">
                The top 10 recommendations for the user are as follows:
              </h1>
            ) : null}
            {recom && !recom.error ? (
              recom.recommendations.map((book: any, index: number) => (
                <div key={book.isbn}>
                  <h1 className=" text-center bg-gray-950 w-fit p-2 m-auto text-white rounded-md text-2xl">
                    {index + 1}
                  </h1>
                  <p>ISBN: {book.ISBN}</p>
                  <p>Book Title: {book['Book-Title']}</p>
                  <p>Book Author: {book['Book-Author']}</p>
                  <p>Year Of Publication: {book['Year-Of-Publication']}</p>
                  <p>Book Publisher: {book.Publisher}</p>
                </div>
              ))
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
                  <p className=" text-xl font-bold">Predicting...</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      <footer>
        <div className=" flex justify-center items-center mt-5">
          <p className=" text-gray-700">Made by Sabbir Sobhani</p>
        </div>
      </footer>
    </>
  );
}

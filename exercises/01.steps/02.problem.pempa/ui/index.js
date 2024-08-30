// 🐨 Add an event listener for 'DOMContentLoaded'
// Inside the event listener:
// 🐨 Get the form element with the id 'counter-form'
// 🐨 Add a submit event listener to the form

// In the form submit event listener:
// 🐨 Prevent the default form submission behavior
// 🐨 Create a new FormData object from the form
// 🐨 If there's a submitter (button clicked), append its name and value to the FormData
// 🐨 Get the form's action URL and method
// 🐨 Send a fetch request to the action URL with the form data
// 🐨 If the response is successful:
//    - Parse the JSON response to get the new count
//    - Update the text content of the element with id 'count' to display the new count
// 🐨 If the response fails, log an error to the console

// 💰 Make sure to handle asynchronous operations properly using async/await

// myangular.js

(function() {
    var app = angular.module('myApp', []);
    app.controller('myCtrl', function($scope, $http) {

        var resetmodel = function() {
            $scope.addbookTitle = 'Add Title';
            $scope.addbookAuthor = 'Add Author';
            $scope.addbookGenre = 'Add Genre';
            $scope.addbookRead = false;
            $scope.editbookid = "";
            $scope.editbookid = false;
            $scope.message = "";
        };

        var getbookjsonstring = function() {
            return '{"title": "' + $scope.addbookTitle +
                '", "author": "' + $scope.addbookAuthor +
                '", "genre": "' + $scope.addbookGenre +
                '", "read": ' + $scope.addbookRead + '}';
        };

        resetmodel();

        // GET request for all books returns
        var onBooksComplete = function(response) {
            $scope.books = response.data;
            $scope.message = "";
        };

        // Requested method returns error
        var onBooksError = function(reason) {
            $scope.message = reason;
        };

        // Make a GET request to list all the books
        $scope.message = "Trying to get books";
        $http.get('https://resttest-sxm1972.c9users.io/api/Books')
            .then(onBooksComplete, onBooksError);

        //User has submitted the changes
        $scope.onSubmit = function() {
            if ($scope.editbook) {
                editBook();
            }
            else {
                addNewBook();
            }
        };

        // POST request to add a new book has completed successfully
        var onAddNewBookComplete = function(response) {
            $scope.books.push(response.data);
            resetmodel();
            $scope.message = "Book added successfully!";
        };

        // PUT request to edit a new book has completed successfully
        var onEditBookComplete = function(response) {
            var id = response.data._id;
            var books = $scope.books;
            $scope.books = books.filter(function(a) {
                return a._id != id;
            });
            $scope.books.push(response.data);
            resetmodel();
        };

        // User has clicked submit to EDIT a book
        var editBook = function(id) {
            var id = $scope.editbookid;
            var jsonstr = getbookjsonstring();
            $scope.message = "Editing the book: " + $scope.addbookTitle;
            var bookjson = JSON.parse(jsonstr);
            $http.put('https://resttest-sxm1972.c9users.io/api/Books/' + id, bookjson)
                .then(onEditBookComplete, onBooksError);
        };

        // User has clicked submit to ADD a book
        var addNewBook = function() {
            var jsonstr = getbookjsonstring();
            $scope.message = "Adding new book";
            var bookjson = JSON.parse(jsonstr);
            $http.post('https://resttest-sxm1972.c9users.io/api/Books', bookjson)
                .then(onAddNewBookComplete, onBooksError);
        };


        // DELETE request has completed successfully
        var onDeleteBookComplete = function(response) {
            var id = response.data.replace(/^.*: /, '');
            var books = $scope.books;
            $scope.books = books.filter(function(a) {
                return a._id != id;
            });;
            $scope.message = "Deleted";
        };

        // User has clicked DELETE to remove a book
        $scope.deleteBook = function(item) {
            $scope.message = "Deleting book";
            $http.delete('https://resttest-sxm1972.c9users.io/api/Books/' + item._id)
                .then(onDeleteBookComplete, onBooksError);
        };

        // User has clicked EDIT to edit a book. Move Book details to the form fields
        $scope.editBook = function(item) {
            $scope.message = "Make your changes and Submit ";
            $scope.editbookid = item._id;
            $scope.addbookTitle = item.title;
            $scope.addbookAuthor = item.author;
            $scope.addbookGenre = item.genre;
            $scope.addbookRead = item.read;
            $scope.editbook = true;
        };

        // User has clicked Mark as Read button on a book
        $scope.markasRead = function(item) {
            $scope.message = "Marking book " + item.title + " as read";
            var jsonstr = '{"read": true}';
            var bookjson = JSON.parse(jsonstr);
            $http.patch('https://resttest-sxm1972.c9users.io/api/Books/' + item._id, bookjson)
                .then(onEditBookComplete, onBooksError);
        };
    });

}());
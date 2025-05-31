
//// TASK 2
// Query to find all books in the genre of Fiction
db.books.find({genre: "fiction"})

// Query to find all books published after 1950
db.books.find( { published_year : { $gt : 1950 } } )

// Query to find books by author: "F. Scott Fitzgerald"
db.books.find({author: "F. Scott Fitzgerald"})

// Updates book with title of 'The Great Gatsby' to a new price of 20.00
db.books.updateOne( {title: 'The Great Gatsby'},{$set :{price: 20.00 } } )

// Deletes book with a title of 'The Great Gatsby'
db.books.deleteOne({title: 'The Great Gatsby'})

//// TASK 3
// query to find books that are both in stock and published after 2010
db.books.find({in_stock : true,published_year : { $gt: 2010}})

// query to find books that are both in stock and published after 2010 while using projection to return only the title, author, and price fields in your queries
db.books.find({in_stock : true,published_year : { $gt: 1950}}, {title: 1, author: 1, price: 1 , _id: 0 })

//Implement sorting to display books by price in ascending order
db.books.find({in_stock : true,published_year : { $gt: 1950}}, {title: 1, author: 1, price: 1 , _id: 0 }).sort({ price: 1})


//Implement sorting to display books by price in descending order
db.books.find({in_stock : true,published_year : { $gt: 1950}}, {title: 1, author: 1, price: 1 , _id: 0 }).sort({ price: -1})

//the `limit` and `skip` methods to implement pagination (5 books per page)
db.books.find().sort({price: -1}).skip(0).limit(5)

//// TASK 4
// Query to create an aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
  {$group: {_id : "$genre", avg_books: {$avg : "$price"}}}
])

//Create an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
  {$group:{_id:"$author",totalBooks : { $sum: 1 }}},{$sort: { totalBook: -1 }},{$limit: 1}])

// Query to implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $toString: { $multiply: [10, { $floor: { $divide: ["$published_year", 10] } }] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
])


//// TASK 5
// Create an index on the `title` field for faster searches
db.books.createIndex({ title: 1})
// Query to Create a compound index on `author` and `published_year`
db.books.createIndex({author: 1, published_year: -1})

//Query with the `explain()` method to demonstrate the performance improvement with your indexes
db.books.find({author: "Emily Brontë", published_year: 1847 }).explain("executionStats")
var blogTemplate =
  '<li class="js-blog-item">' +
  '<p><span class="blog-item js-blog-item-title"></span></p>' +
  '<p><span class="blog-item js-blog-item-content"></span></p>' +
  '<p><span class="blog-item js-blog-item-author"></span></p>' +
  '<p><span class="blog-item js-blog-item-publish-date"></span></p>' +
  '<div class="blog-item-controls">' +
  '<button class="js-blog-item-delete">' +
  '<span class="button-label">delete</span>' +
  "</button>" +
  "</div>" +
  "</li>";

var blog_URL = "/blog";

function getAndDisplayBlog() {
  console.log("Retrieving blog");
  $.getJSON(blog_URL, function(items) {
    console.log("Rendering blog");
    var itemElements = items.map(function(item) {
      var element = $(blogTemplate);
      element.attr("id", item.id);
      var itemTitle = element.find(".js-blog-item-title");
      itemTitle.text(item.title);
      var itemContent = element.find(".js-blog-item-content");
      itemContent.text(item.content);
      var itemAuthor = element.find(".js-blog-item-author");
      itemAuthor.text(item.author);
      var itemPublishDate = element.find(".js-blog-item-publish-date");
      itemPublishDate.text(item.publishDate);
      // element.attr("data-checked", item.checked);
      // if (item.checked) {
      //   itemName.addClass("blog-item__checked");
      // }
      return element;
    });
    $(".js-blog").html(itemElements);
  });
}

function addBlogItem(item) {
  console.log("Adding blog item: ");
  console.log(item);
  $.ajax({
    method: "POST",
    url: blog_URL,
    data: JSON.stringify(item),
    success: function(data) {
      getAndDisplayBlog();
    },
    dataType: "json",
    contentType: "application/json"
  });
}

function deleteBlogItem(itemId) {
  console.log("Deleting blog item `" + itemId + "`");
  $.ajax({
    url: blog_URL + "/" + itemId,
    method: "DELETE",
    success: getAndDisplayBlog
  });
}

function updateBlogitem(item) {
  console.log("Updating blog item `" + item.id + "`");
  $.ajax({
    url: blog_URL + "/" + item.id,
    method: "PUT",
    data: JSON.stringify(item),
    success: function(data) {
      getAndDisplayBlog();
    },
    dataType: "json",
    contentType: "application/json"
  });
}

function handleBlogAdd() {
  $("#js-blog-form").submit(function(e) {
    e.preventDefault();
    addBlogItem({
      title: $(e.currentTarget)
        .find("#js-new-title")
        .val(),
      content: $(e.currentTarget)
        .find("#js-new-content")
        .val(),
      author: $(e.currentTarget)
        .find("#js-new-author")
        .val(),
      publishDate: $(e.currentTarget)
        .find("#js-new-publish-date")
        .val()
    });
  });
}

function handleBlogDelete() {
  $(".js-blog").on("click", ".js-blog-item-delete", function(e) {
    e.preventDefault();
    deleteBlogItem(
      $(e.currentTarget)
        .closest(".js-blog-item")
        .attr("id")
    );
  });
}

$(function() {
  getAndDisplayBlog();
  handleBlogAdd();
  handleBlogDelete();
});

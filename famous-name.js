$(document).ready(function(){
   var divFamousNames = $(".famous_name");
   divFamousNames.map(function() {
       var key = $(this).data("famous-name-key");
       var domHtml = $(this)
       if (key !== undefined && key != "") {

           var ajaxInfo = $.ajax({
               url: "https://api-zipped-sandbox.flexmoney.vn/v1/guest/notable/detail/" + key, 
               type: 'get',
               success: function(result) {},
               error : function(request, error) {
                   console.log(error);
               }
           });

           var ajaxRelated = $.ajax({
               url: "https://api-zipped-sandbox.flexmoney.vn/v1/guest/notable/news/" + key + "?page=1", 
               type: 'get',
               success: function(result) {},
               error : function(request, error) {
                   console.log(error);
               }
           });

           var htmlContentTemplate = "<div class='famous-names-popup'><div class='famous-names-cnt'><div class='famous-names-ttl-l'><div class='famous-names-ttl-box'><div class='famous-names-ttl-img'><img src='${image_url}' alt=''></div><div class='famous-names-ttl-cnt'><h2>${title}</h2><p>${short_description}</p><p class='famous-names-ttl-link'>${article_counter}+ Tin tức</p></div></div></div><div class='famous-names-ttl-info'>${description}<span class='famous-names-ttl-more'>Xem thêm >></span></div><div class='famous-names-relevant'><div class='famous-names-relevant-more'><span>Xem ${article_counter}+ tin tức ></span></div><div class='news-lst'>${news_related}</div></div></div></div>";
           var htmlNewsTemplate = "<div class='news-lst-item'><div class='news-lst-item-img'><a href='${news_url}'><img src='${thumbnail_url}' alt='' /></a></div><div class='news-lst-item-info'><div class='news-lst-item-info-ttl'><div class='news-lst-item-info-ttl-l'><span>${topic}</span>${published_time}<a href='#'>Theo dõi</a></div><p class='news-lst-item-info-more'><a href='#'><img src='https://media-uat.zipped.news/public/img/MoreOutlined.svg' alt='' /></a></p></div><h2><img src='${paywall_icon}' alt=''/>${title}</h2><div class='news-lst-item-info-action'><p class='comment'><a href='#'><img src='https://media-uat.zipped.news/public/img/MessageOutline.svg' alt='' /></a>${comment_counter}</p><p class='social'><img src='https://media-uat.zipped.news/public/img/reaction.svg' alt='' />${reaction_counter}</p></div></div></div>";
           $.when(ajaxInfo, ajaxRelated)
           .then(function(info, related) {
               console.log(info[0]); // Alerts 200
               console.log(related[0]); // Alerts 200
               var detail = info[0].data;
               var article = related[0].data;
               var htmlContent = htmlContentTemplate.replaceAll("${title}", detail.display_name)
               htmlContent = htmlContent.replaceAll("${image_url}", detail.image_url)
               htmlContent = htmlContent.replaceAll("${article_counter}", detail.article_counter)
               htmlContent = htmlContent.replaceAll("${short_description}", detail.short_description)
               htmlContent = htmlContent.replaceAll("${description}", detail.description)
               
               var newsHtml = "";
               
               for (var i = 0; i < article.length; i++) {
                   var newsItem = article[0]
                   var newsItemHtml = htmlNewsTemplate.replaceAll("${article_counter}", newsItem.title)
                   newsItemHtml = newsItemHtml.replaceAll("${news_url}", "https://zipped.news/a/" + newsItem.id)
                   newsItemHtml = newsItemHtml.replaceAll("${thumbnail_url}", newsItem.thumbnail)
                   newsItemHtml = newsItemHtml.replaceAll("${comment_counter}", newsItem.comment_counter)
                   newsItemHtml = newsItemHtml.replaceAll("${reaction_counter}", newsItem.reaction_counter)
                   newsItemHtml = newsItemHtml.replaceAll("${topic}", topicName)
                   newsItemHtml = newsItemHtml.replaceAll("${topic_url}", topicUrl)
                   newsItemHtml = newsItemHtml.replaceAll("${paywall_icon}", newsItem.pay_wall ? "https://media-uat.zipped.news/public/img/icon-paywall.svg" : "")

                   var topicName = "";
                   var topicUrl = "https://zipped.news/discover?t=topic"
                   if (newsItem.relevant_topics && newsItem.relevant_topics.length > 0) {
                       topicName = newsItem.relevant_topics[0].name;
                       topicUrl = "https://zipped.news/t/" + newsItem.relevant_topics[0].id;
                   }
                   
                   
                   newsHtml = newsHtml + newsItemHtml
               }
               
               htmlContent = htmlContent.replaceAll("${news_related}", newsHtml)

               domHtml.html('')
               domHtml.html(' ' + detail.display_name + ' ' + htmlContent)
           }) 
       }
   })
});

# BookWorm

Social media app for books. Users can review books and discuss them on a home feed. They can also favorite books and add them to their profile.

# Things to note

-   While a jwt token is created when logging in or registering, nothing is ever done with it. I gave up on authenticating the token because it was becoming too time consuming to figure out and i had to focus on more important things
-   there is a 0.5 second delay on the search to prevent a fetch from happening on each letter that is typed.
-   Google's Book API really isnt the best. The search is meant to be sorted by relevancy but in my opinion its pretty bad. On top of that, the data returned can be pretty inconsistent. Sometimes the images, authors or categories are missing entirely.

# What I learnt from this project

## The importance of planning and organizing from the start.

> I spent a lot of time rewritting parts of the project and copying styled components. By the time I reached the styling phase it was too late to utilize globalstyles.

## Styling will always take longer than you expect

> I figured it would only take a few hours. Boy was I wrong. CSS is never easy. Esspecially when you are trying to fit inconsistent image sizes nicely in a flexbox.

---

In conclusion, while I wasn't able to take this project in the direction I wanted I have learnt a lot from it and

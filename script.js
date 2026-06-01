let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
let form = document.getElementById("ideaForm");
let startBtn = document.getElementById("startBtn");
let navAddBtn = document.getElementById("navAddBtn");
let loader = document.getElementById("loader");
let container = document.getElementById("container");

let editingIndex = -1;
let isInitialRender = true;

startBtn.addEventListener("click", openForm);
navAddBtn.addEventListener("click", openForm);

function openForm(){
    form.style.display = "flex";
    document.getElementById("explore").scrollIntoView({
        behavior: "smooth"
    });
}

form.addEventListener("submit", addIdea);

function addIdea(event){
    event.preventDefault();
    let name = document.getElementById("name").value;
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let tags = document.getElementById("tags").value;
    let category = document.getElementById("category").value;

    let rawTags = tags.split(",");
    let cleanTags = [];
    for(let i = 0; i < rawTags.length; i++) {
        let trimmed = rawTags[i].trim();
        if(trimmed !== "") {
            cleanTags.push(trimmed);
        }
    }

    if (editingIndex > -1) {
        ideas[editingIndex].name = name;
        ideas[editingIndex].title = title;
        ideas[editingIndex].description = description;
        ideas[editingIndex].tags = cleanTags;
        ideas[editingIndex].category = category;
        
        showToast("Idea updated successfully!");
        editingIndex = -1;
        form.querySelector("button[type='submit']").innerText = "Add Idea";
    } else {
        let idea = {
            name: name,
            title: title,
            description: description,
            tags: cleanTags,
            category: category,
            likes: 0,
            liked: false,
            showCommentSection: false, // Shuru me band rahega
            comments: [] 
        };
        ideas.push(idea);
        showToast("Idea added successfully!");
    }
    
    localStorage.setItem("ideas", JSON.stringify(ideas));
    isInitialRender = false; 
    showIdeas();
    
    form.reset();
    form.style.display = "none";
}

function showToast(message) {
    let toastContainer = document.getElementById("toastContainer");
    let toast = document.createElement("div");
    toast.classList.add("toast");
    
    let icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-circle-check");
    icon.style.color = "#2563eb";
    
    let textSpan = document.createElement("span");
    textSpan.innerText = message;
    
    toast.appendChild(icon);
    toast.appendChild(textSpan);
    toastContainer.appendChild(toast);
    
    setTimeout(function() {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

function showIdeas(){
    let delay = 0;
    if (isInitialRender === true) {
        delay = 500;
        loader.style.display = "flex";
        container.innerHTML = "";
    } else {
        delay = 0;
    }

    setTimeout(function(){
        loader.style.display = "none";
        container.innerHTML = "";

        if (ideas.length === 0) {
            let emptyDiv = document.createElement("div");
            emptyDiv.classList.add("empty-state");
            
            let emptyIcon = document.createElement("i");
            emptyIcon.classList.add("fa-regular", "fa-lightbulb");
            
            let emptyTitle = document.createElement("h2");
            emptyTitle.innerText = "No ideas yet.";
            
            let emptyPara = document.createElement("p");
            emptyPara.innerText = "Be the first one to add your innovative thought!";
            
            emptyDiv.appendChild(emptyIcon);
            emptyDiv.appendChild(emptyTitle);
            emptyDiv.appendChild(emptyPara);
            container.appendChild(emptyDiv);
            
            localStorage.setItem("ideas", JSON.stringify(ideas));
            return;
        }

        for(let i = 0; i < ideas.length; i++){
            if (ideas[i].showCommentSection === undefined) {
                ideas[i].showCommentSection = false;
            }

            let card = document.createElement("div");
            card.classList.add("card");
            
            let cardHeader = document.createElement("div");
            cardHeader.classList.add("cardHeaderRow");

            let heading = document.createElement("h1");
            heading.classList.add("cardTitleText");
            heading.innerText = ideas[i].title;
            cardHeader.appendChild(heading);

            let categoryText = document.createElement("span");
            categoryText.classList.add("categoryBadge");
            categoryText.innerText = ideas[i].category;
            cardHeader.appendChild(categoryText);
            
            card.appendChild(cardHeader);

            let para = document.createElement("p");
            para.classList.add("cardDescText");
            para.innerText = ideas[i].description;
            card.appendChild(para);

            let tagBox = document.createElement("div");
            tagBox.classList.add("tagBox");
            for(let j = 0; j < ideas[i].tags.length; j++){
                let span = document.createElement("span");
                span.innerText = "#" + ideas[i].tags[j];
                span.classList.add("tag");
                tagBox.appendChild(span);
            }
            card.appendChild(tagBox);

            let userName = document.createElement("p");
            userName.classList.add("sharedByText");
            userName.innerText = "Shared by: " + ideas[i].name;
            card.appendChild(userName);

            let buttonRow = document.createElement("div");
            buttonRow.classList.add("buttonRow");
            card.appendChild(buttonRow);

            let likeBtn = document.createElement("button");
            likeBtn.classList.add("like");
            likeBtn.innerHTML = '<i class="fa-regular fa-thumbs-up"></i> ' + ideas[i].likes;
            buttonRow.appendChild(likeBtn);

            likeBtn.addEventListener("click", function(){
                isInitialRender = false;
                if(ideas[i].liked === false){
                    ideas[i].likes++;
                    ideas[i].liked = true;
                } else {
                    ideas[i].likes--;
                    ideas[i].liked = false;
                }
                localStorage.setItem("ideas", JSON.stringify(ideas));
                showIdeas();
            });

            let commentBtn = document.createElement("button");
            commentBtn.classList.add("comment");
            commentBtn.innerHTML = '<i class="fa-regular fa-comment"></i> Discussion (' + ideas[i].comments.length + ')';
            buttonRow.appendChild(commentBtn);

            // Discussion touch karte hi toggle hoga
            commentBtn.addEventListener("click", function() {
                isInitialRender = false;
                ideas[i].showCommentSection = !ideas[i].showCommentSection;
                showIdeas();
            });

            let rightButtons = document.createElement("div");
            rightButtons.classList.add("rightButtonsGroup");

            let editBtn = document.createElement("button");
            editBtn.innerText = "Edit";
            editBtn.classList.add("edit");
            rightButtons.appendChild(editBtn);

            editBtn.addEventListener("click", function(){
                isInitialRender = false;
                editingIndex = i; 
                
                document.getElementById("name").value = ideas[i].name;
                document.getElementById("title").value = ideas[i].title;
                document.getElementById("description").value = ideas[i].description;
                document.getElementById("tags").value = ideas[i].tags.join(", ");
                document.getElementById("category").value = ideas[i].category;
                
                form.querySelector("button[type='submit']").innerText = "Update Idea";
                showToast("Editing mode active: Card data copied to form.");
                openForm();
            });

            let deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.classList.add("delete");
            rightButtons.appendChild(deleteBtn);

            deleteBtn.addEventListener("click", function(){
                isInitialRender = false;
                ideas.splice(i, 1);
                localStorage.setItem("ideas", JSON.stringify(ideas));
                showToast("Idea deleted!");
                showIdeas();
            });

            buttonRow.appendChild(rightButtons);

            // AGAR flag true hai tabhi poora section HTML me generate hoga
            if (ideas[i].showCommentSection === true) {
                let commentBox = document.createElement("div");
                commentBox.classList.add("commentBox");
                card.appendChild(commentBox);

                for(let k = 0; k < ideas[i].comments.length; k++){
                    if (typeof ideas[i].comments[k] === "string") {
                        ideas[i].comments[k] = {
                            text: ideas[i].comments[k],
                            replies: [],
                            showReplyForm: false
                        };
                    }

                    let currentComment = ideas[i].comments[k];

                    let commentWrapper = document.createElement("div");
                    commentWrapper.classList.add("commentContainerBlock");

                    let mainCommentRow = document.createElement("div");
                    mainCommentRow.classList.add("commentTextWrapper");

                    let p = document.createElement("p");
                    p.innerText = currentComment.text;
                    p.classList.add("commentText");
                    mainCommentRow.appendChild(p);

                    let commentActions = document.createElement("div");
                    commentActions.classList.add("commentActionButtons");

                    let editCommentBtn = document.createElement("button");
                    editCommentBtn.className = "commentActionIconBtn";
                    editCommentBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
                    editCommentBtn.addEventListener("click", function() {
                        let newText = prompt("Edit your comment:", currentComment.text);
                        if (newText !== null && newText.trim() !== "") {
                            isInitialRender = false;
                            currentComment.text = newText.trim();
                            localStorage.setItem("ideas", JSON.stringify(ideas));
                            showToast("Comment updated!");
                            showIdeas();
                        }
                    });
                    commentActions.appendChild(editCommentBtn);

                    let replyToggleBtn = document.createElement("button");
                    replyToggleBtn.className = "commentActionIconBtn";
                    replyToggleBtn.innerHTML = '<i class="fa-solid fa-reply"></i>';
                    replyToggleBtn.addEventListener("click", function() {
                        isInitialRender = false;
                        currentComment.showReplyForm = !currentComment.showReplyForm;
                        showIdeas();
                    });
                    commentActions.appendChild(replyToggleBtn);

                    let deleteCommentBtn = document.createElement("button");
                    deleteCommentBtn.classList.add("commentActionIconBtn", "deleteHover");
                    deleteCommentBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                    deleteCommentBtn.addEventListener("click", function(){
                        isInitialRender = false;
                        ideas[i].comments.splice(k, 1);
                        localStorage.setItem("ideas", JSON.stringify(ideas));
                        showToast("Comment removed!");
                        showIdeas();
                    });
                    commentActions.appendChild(deleteCommentBtn);

                    mainCommentRow.appendChild(commentActions);
                    commentWrapper.appendChild(mainCommentRow);

                    if (currentComment.replies && currentComment.replies.length > 0) {
                        let repliesBox = document.createElement("div");
                        repliesBox.classList.add("repliesContainerBox");

                        for (let r = 0; r < currentComment.replies.length; r++) {
                            let replyTextWrapper = document.createElement("div");
                            replyTextWrapper.classList.add("replyTextWrapper");

                            let replyP = document.createElement("p");
                            replyP.innerText = currentComment.replies[r];
                            replyP.classList.add("commentText");
                            replyTextWrapper.appendChild(replyP);

                            let deleteReplyBtn = document.createElement("button");
                            deleteReplyBtn.className = "commentActionIconBtn deleteHover";
                            deleteReplyBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                            deleteReplyBtn.addEventListener("click", function() {
                                isInitialRender = false;
                                currentComment.replies.splice(r, 1);
                                localStorage.setItem("ideas", JSON.stringify(ideas));
                                showToast("Reply removed!");
                                showIdeas();
                            });

                            replyTextWrapper.appendChild(deleteReplyBtn);
                            repliesBox.appendChild(replyTextWrapper);
                        }
                        commentWrapper.appendChild(repliesBox);
                    }

                    if (currentComment.showReplyForm === true) {
                        let replyInputWrapper = document.createElement("div");
                        replyInputWrapper.classList.add("replyInputWrapper");

                        let replyInput = document.createElement("input");
                        replyInput.type = "text";
                        replyInput.placeholder = "Write a reply...";
                        replyInput.classList.add("commentInput");
                        replyInputWrapper.appendChild(replyInput);

                        let submitReplyBtn = document.createElement("button");
                        submitReplyBtn.classList.add("submitCommentBtn");
                        submitReplyBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
                        replyInputWrapper.appendChild(submitReplyBtn);

                        let triggerReplySubmit = function() {
                            let rText = replyInput.value.trim();
                            if (rText === "") return;
                            isInitialRender = false;
                            if (!currentComment.replies) {
                                currentComment.replies = [];
                            }
                            currentComment.replies.push(rText);
                            currentComment.showReplyForm = false;
                            localStorage.setItem("ideas", JSON.stringify(ideas));
                            showToast("Reply posted!");
                            showIdeas();
                        };

                        submitReplyBtn.addEventListener("click", triggerReplySubmit);
                        replyInput.addEventListener("keydown", function(e) {
                            if (e.key === "Enter") triggerReplySubmit();
                        });

                        commentWrapper.appendChild(replyInputWrapper);
                    }

                    commentBox.appendChild(commentWrapper);
                }

                let inputWrapper = document.createElement("div");
                inputWrapper.classList.add("commentInputWrapper");

                let commentInput = document.createElement("input");
                commentInput.type = "text";
                commentInput.placeholder = "Add Comment....";
                commentInput.classList.add("commentInput");
                inputWrapper.appendChild(commentInput);

                let submitCommentBtn = document.createElement("button");
                submitCommentBtn.classList.add("submitCommentBtn");
                submitCommentBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
                inputWrapper.appendChild(submitCommentBtn);
                card.appendChild(inputWrapper);

                let triggerMainComment = function(){
                    let text = commentInput.value.trim();
                    if(text === "") return;
                    
                    // Instant update ke liye spinner loader ko block karein
                    isInitialRender = false;
                    
                    ideas[i].comments.push({
                        text: text,
                        replies: [],
                        showReplyForm: false
                    });
                    
                    // FIXED: Comment send karte hi section ko instantly false (hide) karein
                    ideas[i].showCommentSection = false; 
                    
                    // LocalStorage me update ko save karein
                    localStorage.setItem("ideas", JSON.stringify(ideas));
                    showToast("Comment shared!");
                    
                    // UI render bina kisi glitch ke instantly clean ho jayegi
                    showIdeas();
                };

                submitCommentBtn.addEventListener("click", triggerMainComment);
                commentInput.addEventListener("keydown", function(e){
                    if(e.key === "Enter") triggerMainComment();
                });
            }

            container.appendChild(card);
        }

        localStorage.setItem("ideas", JSON.stringify(ideas));
        isInitialRender = false; 
    }, delay);
}

showIdeas();
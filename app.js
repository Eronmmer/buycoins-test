const myGitHubToken = "15a25fb76636f60f724f74558699312c7c10a794";
const mainBody = document.querySelector(".gh");

const fetchedRepositories = (repo) => {
	return `<li class="gh-main__repos__repo">
    <div class="gh-main__repos__repo__top">
			<div class="gh-main__repos__repo__details">
				<h2 class="title">
					<a target="_blank" href=https://github.com/eronmmer/${repo.node.name}>
						${repo.node.name}
					</a>
				</h2>
				<p class="desc">
					${repo?.node?.description || ""}
				</p>
			</div>
			<a href="#!" class="gh-btn gh-btn--light gh-btn--sm"><span class="icon" data-feather="star"></span>&nbsp; Star</a>
		</div>
		<div class="gh-main__repos__repo__details__extra">
			 <span class="detail">${repo.node?.primaryLanguage?.name || ""}</span>
				<span class="detail"><span data-feather="star"></span> ${
					repo.node.stargazerCount
				} </span>
				<span class="detail"><span data-feather="git-branch"></span> ${
					repo.node.forkCount
				} </span>
			<span class="detail"> Updated on ${
				new Date(repo.node.updatedAt).toString().split(" ")[2]
			} ${new Date(repo.node.updatedAt).toString().split(" ")[1]} </span>
		</div>
  </li>`;
};

const query = `
    query { 
        user(login: "eronmmer") { 
        name
        bio
        login
        company
        location
        avatarUrl
        websiteUrl
        twitterUsername
        following{
          totalCount 
        }
        followers{
          totalCount
        }
        starredRepositories{
          totalCount
        }
        repositories(last:20) {
            totalCount
            edges {
            node{
                primaryLanguage {
                  name
                }
                name
                description
                updatedAt
                forkCount
                stargazerCount
              }
            }
        }
        }
    }
`;

const loadRepositories = async () => {
	mainBody.classList.add("initial");
	try {
		const res = await fetch(`https://api.github.com/graphql`, {
			method: "post",
			headers: {
				"Content-Type": "application/graphql",
				Authorization: `Bearer ${myGitHubToken}`,
			},
			body: JSON.stringify({ query }),
		});
		const data = await res.json();

		// update page with fetched data
		document.querySelector(".gh-main__profile__user__name_inner").innerHTML =
			data.data.user.name;
		document.querySelector(".username").innerHTML = data.data.user.login;
		document.querySelector(".gh-main__profile__about").innerHTML =
			data.data.user.bio;
		document.querySelector("#follower-count").innerHTML =
			data.data.user.followers.totalCount;
		document.querySelector("#following-count").innerHTML =
			data.data.user.following.totalCount;
		document.querySelector("#starred-count").innerHTML =
			data.data.user.starredRepositories.totalCount;
		document.querySelector(".main__profile__user__img").src =
			data.data.user.avatarUrl;
		document.querySelector(".main__profile__user__img_sm").src =
			data.data.user.avatarUrl;
		document.querySelector(".pill").innerHTML =
			data.data.user.repositories.totalCount;

		data.data.user.repositories.edges.map((repo) => {
			document.querySelector(
				".gh-main__repos__list"
			).innerHTML += fetchedRepositories(repo);
			feather.replace();
		});
	} catch (err) {
		console.log(err);
	} finally {
		mainBody.classList.remove("initial");
	}
};

window.onload = () => {
	loadRepositories();
};

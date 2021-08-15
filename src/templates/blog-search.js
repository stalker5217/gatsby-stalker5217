import React, { useState } from 'react';
import { Link, graphql } from "gatsby"
import { FormControl } from 'react-bootstrap'

import Layout from "../components/layout"
import Bio from "../components/bio"
import SEO from "../components/seo"

const BlogSearch = ( {data, location } ) => {
	const siteTitle = data.site.siteMetadata?.title || `Title`

	const posts = data.allMarkdownRemark.nodes

	const [searchedPost, setSearchedPost] = useState([])

	const onChange = (event) => {
		const query = event.target.value

		if(query.length < 2) {
			setSearchedPost([])
			return
		}
			
		const result = posts.filter((post) => {
			const {title, categories, tags} = post.frontmatter;

			return (
				(typeof(title) === 'string' && title.toLowerCase().indexOf(query.toLowerCase()) >= 0)
				|| (Array.isArray(categories) && categories.map(s => s.toLowerCase()).includes(query.toLowerCase))
				|| (Array.isArray(tags) && tags.map(s => s.toLowerCase()).includes(query.toLowerCase))
			)
		})

		setSearchedPost(result)
	}

	return (
		<Layout location={location} title={siteTitle}>
			<SEO title="All posts" />
			<Bio />
			
			<FormControl
				placeholder="Search"
				aria-label="Search"
				aria-describedby="basic-addon2"
				onChange = {onChange}
			/>

			<ol style={{ listStyle: `none` }}>
				{
					searchedPost.map(post => {
						const title = post.frontmatter.title || post.fields.slug
						const tags = post.frontmatter.tags;
						
						return (
							<li key={post.fields.slug}>
							<article
								className="post-list-item"
								itemScope
								itemType="http://schema.org/Article"
							>
								<header>
								<h2>
									<Link to={post.fields.slug} itemProp="url">
									<span itemProp="headline">{title}</span>
									</Link>
								</h2>

								<small>{post.frontmatter.date}</small> 
								&nbsp; &#183;
								{tags.map(tag => {
									const randomKey = Math.random().toString(36).substr(2,11)
									return (<span key={randomKey} className="post-tag">#{tag}</span>);
								})}
								
								<br/>

								</header>

								<section>
								<p
									dangerouslySetInnerHTML={{
									__html: post.frontmatter.description || post.excerpt,
									}}
									itemProp="description"
								/>
								</section>
							</article>
							</li>
						)
					})
				}
			</ol>
		</Layout>
	);
}

export default BlogSearch

export const pageQuery = graphql`
  query blogSearchQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
		sort: { fields: [frontmatter___date], order: DESC }
	) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
		  tags
		  categories
        }
      }
    }
  }
`
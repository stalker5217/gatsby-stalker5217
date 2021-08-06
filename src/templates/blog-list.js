import React from 'react'
import Img from "gatsby-image"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Pager from '../components/pager'

const BlogIndex = ({ data, pageContext, location }) => {
	const siteTitle = data.site.siteMetadata?.title || `Title`
  	const posts = data.allMarkdownRemark.nodes

	if (posts.length === 0) {
		return (
		<Layout location={location} title={siteTitle}>
			<SEO title="All posts" />
			<Bio />
			<p>
			No blog posts found. Add markdown posts to "content/blog" (or the
			directory you specified for the "gatsby-source-filesystem" plugin in
			gatsby-config.js).
			</p>
		</Layout>
		)
	}

	return (
		<Layout location={location} title={siteTitle}>
			<SEO title="All posts" />
			<Bio />
			
			<ol style={{ listStyle: `none` }}>
				{posts.map(post => {
				const title = post.frontmatter.title || post.fields.slug
				const indexImage = post.frontmatter.indexImage
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
						{tags.map(tag => <span className="post-tag">#{tag}</span>)}
						
						<br/>

						</header>
						{
							indexImage && (
							<Img
								fluid={indexImage.childImageSharp.fluid}
							/>
							)
						}
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
				})}
			</ol>

			<Pager pageContext={pageContext} />
		</Layout>
	)
}

export default BlogIndex

export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
		sort: { fields: [frontmatter___date], order: DESC }
		limit: $limit
		skip: $skip
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
          indexImage {
            childImageSharp {
              fluid(maxWidth: 630) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`

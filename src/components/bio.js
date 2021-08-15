/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import Image from "gatsby-image"
import { AiOutlineGithub, AiOutlineFileSearch } from 'react-icons/ai'
import { IconContext } from "react-icons/lib"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.png/" }) {
        childImageSharp {
          fixed(width: 65, height: 65, quality: 95) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
            github
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  const avatar = data?.avatar?.childImageSharp?.fixed

  return (
    <div className="bio">
      {avatar && (
        <Image
          fixed={avatar}
          alt={author?.name || ``}
          className="bio-avatar"
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
      )}
      <div>
        {author?.name && (
          <div>
            <p>
              <strong> {author.name} </strong> 
            </p>
            {author ? <p> {author.summary} </p> : null} 
          </div>
        )}
        <div className='social-container'>
            <IconContext.Provider value={{ size: '2em', color: 'grey'}}>
              <Link to='/search'>
                <AiOutlineFileSearch/>
              </Link>
              
              <Link to={`https://github.com/${social?.github || ``}`}>
                <AiOutlineGithub/>
              </Link>
            </IconContext.Provider>
        </div>
      </div>
    </div>
  )
}

export default Bio

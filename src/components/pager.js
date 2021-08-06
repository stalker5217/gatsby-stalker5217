import React from 'react';
import { Link } from 'gatsby';
// import { rhythm } from '../utils/typography'

const Pager = ({ pageContext }) => {
  const { currentPage, numPages } = pageContext

  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? '/' : '/' + (currentPage - 1).toString()
  const nextPage = '/' + (currentPage + 1).toString();
  
  const showingPageCnt = 10
  let rangeStartPage = (Math.floor((currentPage - 1) / showingPageCnt) * showingPageCnt);
  if(rangeStartPage + showingPageCnt > numPages) rangeStartPage = numPages - showingPageCnt

  const pageRange = Array.from( {length: showingPageCnt}, (_, i) => rangeStartPage + i + 1)
  
  return (
    <ul
		style={{
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: 'space-between',
			alignItems: 'center',
			listStyle: 'none',
			padding: 0,
		}}
	>
		{!isFirst && (
			<Link 
				to={"/"} rel="first"
				style={{
					textDecoration: 'none',
					color: '#000000'
				}}
			>
				&lt;&lt;
			</Link>
		)}

		{!isFirst && (
			<Link 
				to={prevPage} rel="prev"
				style={{
					textDecoration: 'none',
					color: '#000000'
				}}
			>
				&lt;
			</Link>
		)}

		{Array.from(pageRange, page => (
			<li
				key={`pagination-number-${page}`}
				style={{
					margin: 0,
				}}
				>
				<Link
					to={`/${page === 1 ? '' : page}`}
					style={{
					// padding: rhythm(1 / 4),
					textDecoration: 'none',
					color: page === currentPage ? '#d40000' : '#000000',
					}}
				>
					{page}
				</Link>
			</li>
		))}
				
		{!isLast && (
			<Link 
				to={nextPage} rel="next"
				style={{
					textDecoration: 'none',
					color: '#000000'
				}}
			>
				&gt;
			</Link>
		)}

		{!isLast && (
			<Link 
				to={`/${numPages}`} rel="last"
				style={{
					textDecoration: 'none',
					color: '#000000'
				}}
			>
				&gt;&gt;
			</Link>
		)}
    </ul>
  )
};

export default Pager;
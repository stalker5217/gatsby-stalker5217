import React from 'react';
import { Link } from 'gatsby';

const Pager = ({ pageContext }) => {
  const { currentPage, numPages } = pageContext

  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? '/' : '/' + (currentPage - 1).toString()
  const nextPage = '/' + (currentPage + 1).toString();
  
  const showingPageCnt = 5
  let rangeStartPage = (Math.floor((currentPage - 1) / showingPageCnt) * showingPageCnt);
  if(rangeStartPage + showingPageCnt > numPages) rangeStartPage = numPages - showingPageCnt

  const pageRange = Array.from( {length: showingPageCnt}, (_, i) => rangeStartPage + i + 1)
  
  return (
    <ul className="page-list">
		{!isFirst && (
			<>
				<li className="page-list-element">
					<Link to={"/"} rel="first"> &lt;&lt; </Link>
				</li>
				<li className="page-list-element">
					<Link to={prevPage} rel="prev"> &lt; </Link>
				</li>
			</>
		)}

		{Array.from(pageRange, page => (
			<li 
				className={page === currentPage ? "page-list-element on" : "page-list-element"}
				key={`pagination-number-${page}`}
			>
				<Link to={`/${page === 1 ? '' : page}`}>
					{page}
				</Link>
			</li>
		))}
				
		{!isLast && (
			<>
				<li className="page-list-element">
					<Link to={nextPage} rel="next"> &gt; </Link>
				</li>
				<li className="page-list-element">
					<Link to={`/${numPages}`} rel="last"> &gt;&gt;</Link>
				</li>
			</>
		)}
    </ul>
  )
};

export default Pager;
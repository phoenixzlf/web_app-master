import React, {useEffect, useState} from 'react';
import Pagination from 'react-bootstrap/Pagination';
import styled from "styled-components";

const CLDPagContainer = styled.div`
  align-content: center;
  display: flex;
  margin: 10px 5px;
`

const CLPPaginationC = styled(Pagination)`
  margin: 0 auto;
`

const CLPPaginationItem = styled(Pagination.Item)`
  a{
    color: #002855;
  }
  li{
    color: #002855;
    background-color: #002855;
  }
  span{
    color: #002855;
    background-color: #002855 !Important;
  }
`

const CLPPaginationEllipsis = styled(Pagination.Ellipsis)`
  a{
    color: #002855;
  }
  li{
    color: #002855;
  }
  span{
    color: #002855;
  }
`

const DOTS = "...";

const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};


const CLDPagination = props => {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
    } = props;

    // const [paginationRange, setPaginationRage] = useState([]);

    function getPaRange() {
        const totalPageCount = Math.ceil(totalCount / pageSize);

        // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
        const totalPageNumbers = siblingCount + 5;

        /*
          Case 1:
          If the number of pages is less than the page numbers we want to show in our
          paginationComponent, we return the range [1..totalPageCount]
        */
        if (totalPageNumbers >= totalPageCount) {
            // setPaginationRage(range(1, totalPageCount));
            // console.log("return:" + range(1, totalPageCount))
            return range(1, totalPageCount);
        }

        /*
            Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
        */
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPageCount
        );

        /*
          We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
        */
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        /*
            Case 2: No left dots to show, but rights dots to be shown
        */
        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);

            // setPaginationRage([...leftRange, DOTS, totalPageCount])
            return [...leftRange, DOTS, totalPageCount];
        }

        /*
            Case 3: No right dots to show, but left dots to be shown
        */
        if (shouldShowLeftDots && !shouldShowRightDots) {

            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(
                totalPageCount - rightItemCount + 1,
                totalPageCount
            );
            // setPaginationRage([firstPageIndex, DOTS, ...rightRange])
            return [firstPageIndex, DOTS, ...rightRange];
        }

        /*
            Case 4: Both left and right dots to be shown
        */
        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            // setPaginationRage([firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex])
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
    }

    const paginationRange = getPaRange()

    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);

    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];
    return (
        <CLDPagContainer>
            <CLPPaginationC>
                <CLPPaginationItem
                    disabled={currentPage === 1}
                    onClick={onPrevious}
                >
                    {`<`}
                </CLPPaginationItem>
                {paginationRange.map(pageNumber => {
                    if (pageNumber === DOTS) {
                        return <CLPPaginationEllipsis />;
                    }

                    return (
                        <CLPPaginationItem
                            active={pageNumber === currentPage}
                            onClick={() => onPageChange(pageNumber)}
                        >
                            {pageNumber}
                        </CLPPaginationItem>
                    );
                })}
                <CLPPaginationItem
                    disabled={currentPage === lastPage}
                    onClick={onNext}
                >
                    {`>`}
                </CLPPaginationItem>
            </CLPPaginationC>
        </CLDPagContainer>
    );
};

export default CLDPagination;
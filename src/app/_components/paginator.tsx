import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

interface PaginatorProps {
  pages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({ pages, currentPage, onPageChange }) => {
  const getPageRange = () => {
    let pageNumbers: number[] = [];

    if (pages <= 5) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        // For the first few pages, show page 1, 2, 3, ..., and the last page
        pageNumbers = [1, 2, 3, -1, pages];
      } else if (currentPage >= pages - 2) {
        // For the last few pages, show pages, ..., pages-2, pages-1, pages
        pageNumbers = [1, -1, pages - 2, pages - 1, pages];
      } else {
        // For pages in between, show pages before and after current page
        pageNumbers = [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, pages];
      }
    }

    return pageNumbers;
  };

  console.log('paginator page', currentPage, 'totalpages', pages)

  const handlePageClick = (page: number) => {
    onPageChange(page); // Call the callback function to notify HomePage of page change
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages) {
      handlePageClick(currentPage + 1);
    }
  }

  const pageRange = getPageRange();

  return (
    <div>
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem >
          <PaginationPrevious href="#"
          onClick={() => handlePreviousPage()}/>
        </PaginationItem>

        {/* Render page numbers dynamically */}
        {pageRange.map((page, index) => {
          if (page === -1) {
            return (
              <PaginationItem key={`pg-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={`pg2-${page}`}>
              <PaginationLink
                href={`#${page}`}
                onClick={() => handlePageClick(page)}
                className={page === currentPage ? "font-bold" : ""}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem >
          <PaginationNext href="#" 
          onClick={() => handleNextPage()}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    </div>
  );
};

export default Paginator;

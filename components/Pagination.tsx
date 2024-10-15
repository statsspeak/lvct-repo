import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// "use client";

// import React from "react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   totalCount: number;
// }

// export function Pagination({
//   currentPage,
//   totalPages,
//   totalCount,
// }: PaginationProps) {
//   const router = useRouter();

//   const handlePageChange = (newPage: number) => {
//     router.push(`?page=${newPage}`);
//   };

//   return (
//     <div className="flex items-center justify-between">
//       <p className="text-sm text-gray-700 dark:text-gray-300">
//         Showing page {currentPage} of {totalPages} (Total items: {totalCount})
//       </p>
//       <div className="space-x-2">
//         <Button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="bg-lvct-purple hover:bg-purple-700 text-white"
//         >
//           Previous
//         </Button>
//         <Button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="bg-lvct-purple hover:bg-purple-700 text-white"
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

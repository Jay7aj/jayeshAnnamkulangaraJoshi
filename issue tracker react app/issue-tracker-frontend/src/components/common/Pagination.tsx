// src/components/common/Pagination.tsx

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange
}: PaginationProps) {

  return (
    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>

      <button
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>

    </div>
  );
}
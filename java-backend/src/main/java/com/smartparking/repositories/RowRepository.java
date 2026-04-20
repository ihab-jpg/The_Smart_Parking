package com.smartparking.repositories;

import com.smartparking.models.Row;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RowRepository extends JpaRepository<Row, Long> {
    List<Row> findByLevelId(Long levelId);
    Optional<Row> findByLevelIdAndRowLetter(Long levelId, String rowLetter);
}
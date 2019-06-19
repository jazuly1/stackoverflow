SELECT
  `s`.`ID`,
  `s`.`title`,
  `p`.`ID` AS `ProductID`,
  `eq`.`Score`
FROM `statements` AS `s`
  INNER JOIN `statementstructs` AS `ss`
    ON `s`.`ID` = `ss`.`parent_id`
  INNER JOIN `products` AS `p`
    ON `s`.`primarykey` = `p`.`ID`
    
  LEFT JOIN (
    SELECT
      MAX(ID) maxid,
      ProductID
    FROM extraquestions eq
    WHERE eq.user_id = 2
    AND DATE_FORMAT(eq.Date, "%Y-%m") <= "2019-06-30"
    AND eq.Active = 4
    AND eq.NodeID = "5663"
    GROUP BY ProductID
) eqq ON (`p`.`ID` = `eqq`.`ProductID`)
    
  LEFT JOIN `extraquestions` AS `eq`
    ON (`eq`.`ProductID` = `eqq`.`ProductID`
    AND `eq`.`ID` = `eqq`.`maxid`)
    AND `eq`.`Date` >= '2018-06-19'
    AND (`eq`.`Active` = 4
    AND `eq`.`user_id` = 2)
WHERE (`ss`.`child_id` = 509
AND `eq`.`NodeID` = 5663
AND `s`.`tablename` = 'product'
AND `s`.`Active` = 1
AND `ss`.`Active` = 1
AND `p`.`Active` = 1)
ORDER BY `ss`.`ID` ASC

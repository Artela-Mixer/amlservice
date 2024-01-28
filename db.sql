drop table if exists t_whitelist;
CREATE TABLE `t_whitelist` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `addr` varchar(80) NOT NULL DEFAULT '' COMMENT '白名单地址',
  `root` varchar(80) NOT NULL DEFAULT '' COMMENT 'root',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '状态，0：未激活；1：激活',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modify_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `root` (`root`) USING BTREE,
  KEY `addr` (`addr`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='白名单';


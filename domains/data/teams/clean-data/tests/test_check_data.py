#!/usr/bin/env python3

"""
Unit tests for check_data.py rules.

Each test feeds a known-bad input string to the checker and verifies
the expected rule fires. Tests are grouped by checker (SQL, Python,
Terraform, Structure).

Run: python -m pytest tests/test_check_data.py -v
"""

import os
import sys
import tempfile

# Add scripts/ to path so we can import check_data
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
import check_data


# ── Helpers ──────────────────────────────────────────────────────────────────

def check_sql_str(sql_text):
    """Run SQL checker on a string, return list of rule IDs fired."""
    return [i["rule"] for i in check_data.check_sql("test.sql", sql_text)]


def check_python_str(py_text, filepath="test.py"):
    """Run Python checker on a string, return list of rule IDs fired."""
    return [i["rule"] for i in check_data.check_python(filepath, py_text)]


def check_terraform_str(tf_text):
    """Run Terraform checker on a string, return list of rule IDs fired."""
    return [i["rule"] for i in check_data.check_terraform("test.tf", tf_text)]


def check_s3_str(text, filepath="test.py"):
    """Run S3 pattern checker on a string, return list of rule IDs fired."""
    return [i["rule"] for i in check_data.check_s3_patterns(filepath, text)]


# ══════════════════════════════════════════════════════════════════════════════
#  SQL RULES
# ══════════════════════════════════════════════════════════════════════════════

class TestNoSelectStar:
    def test_fires_on_select_star(self):
        assert "no-select-star" in check_sql_str("SELECT * FROM users;")

    def test_ignores_count_star(self):
        assert "no-select-star" not in check_sql_str("SELECT COUNT(*) FROM users;")

    def test_fires_with_whitespace(self):
        assert "no-select-star" in check_sql_str("SELECT  *  FROM  users;")


class TestCteForComplex:
    def test_fires_on_3_joins_without_cte(self):
        sql = """
        SELECT a.id FROM table_a a
        JOIN table_b b ON a.id = b.a_id
        JOIN table_c c ON b.id = c.b_id
        JOIN table_d d ON c.id = d.c_id;
        """
        assert "cte-for-complex" in check_sql_str(sql)

    def test_no_fire_with_cte(self):
        sql = """
        WITH cte AS (SELECT id FROM table_a)
        SELECT a.id FROM cte a
        JOIN table_b b ON a.id = b.a_id
        JOIN table_c c ON b.id = c.b_id
        JOIN table_d d ON c.id = d.c_id;
        """
        assert "cte-for-complex" not in check_sql_str(sql)

    def test_no_fire_on_simple_query(self):
        assert "cte-for-complex" not in check_sql_str("SELECT id FROM users JOIN orders ON users.id = orders.user_id;")


class TestNoFunctionOnIndex:
    def test_fires_on_year_function(self):
        assert "no-function-on-index" in check_sql_str("SELECT id FROM orders WHERE YEAR(created_at) = 2024;")

    def test_fires_on_upper(self):
        assert "no-function-on-index" in check_sql_str("SELECT id FROM users WHERE UPPER(name) = 'ALICE';")


class TestNoImplicitJoin:
    def test_fires_on_comma_join(self):
        assert "no-implicit-join" in check_sql_str("SELECT a.id FROM users a, orders b WHERE a.id = b.user_id;")

    def test_no_fire_on_explicit_join(self):
        assert "no-implicit-join" not in check_sql_str("SELECT a.id FROM users a JOIN orders b ON a.id = b.user_id;")


class TestUpsertPattern:
    def test_fires_on_insert_without_conflict(self):
        assert "upsert-pattern" in check_sql_str("INSERT INTO users (id, name) VALUES (1, 'Alice');")

    def test_no_fire_with_on_conflict(self):
        assert "upsert-pattern" not in check_sql_str("INSERT INTO users (id, name) VALUES (1, 'Alice') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;")


# ══════════════════════════════════════════════════════════════════════════════
#  PYTHON RULES
# ══════════════════════════════════════════════════════════════════════════════

class TestNoIterrows:
    def test_fires_on_iterrows(self):
        assert "no-iterrows" in check_python_str("for idx, row in df.iterrows():\n    pass")

    def test_fires_on_itertuples(self):
        assert "no-iterrows" in check_python_str("for row in df.itertuples():\n    pass")


class TestExplicitDtypes:
    def test_fires_on_read_csv_without_dtype(self):
        assert "explicit-dtypes" in check_python_str('import pandas as pd\ndf = pd.read_csv("data.csv")')

    def test_no_fire_with_dtype(self):
        assert "explicit-dtypes" not in check_python_str('import pandas as pd\ndf = pd.read_csv("data.csv", dtype={"id": "int64"})')


class TestNoPrintLogging:
    def test_fires_on_print(self):
        assert "no-print-logging" in check_python_str('x = 1\nprint("hello")')

    def test_no_fire_in_test_file(self):
        assert "no-print-logging" not in check_python_str('print("hello")', filepath="test_something.py")

    def test_no_fire_in_main_block(self):
        code = 'if __name__ == "__main__":\n    print("hello")'
        assert "no-print-logging" not in check_python_str(code)


class TestNoBareExcept:
    def test_fires_on_bare_except(self):
        assert "no-bare-except" in check_python_str("try:\n    pass\nexcept:\n    pass")

    def test_fires_on_except_exception_without_reraise(self):
        assert "no-bare-except" in check_python_str("try:\n    pass\nexcept Exception as e:\n    log(e)")

    def test_no_fire_with_reraise(self):
        assert "no-bare-except" not in check_python_str("try:\n    pass\nexcept Exception as e:\n    log(e)\n    raise")


class TestNoSecrets:
    def test_fires_on_password(self):
        assert "no-secrets" in check_python_str('password = "secret123"')

    def test_fires_on_api_key(self):
        assert "no-secrets" in check_python_str('api_key = "sk-abc123def456"')

    def test_fires_on_aws_key(self):
        assert "no-secrets" in check_python_str('key = "AKIAIOSFODNN7EXAMPLE"')


class TestBoto3OutsideHandler:
    def test_fires_inside_handler(self):
        code = "def handler(event, context):\n    client = boto3.client('s3')"
        assert "boto3-outside-handler" in check_python_str(code)

    def test_no_fire_outside_handler(self):
        code = "client = boto3.client('s3')\ndef handler(event, context):\n    pass"
        assert "boto3-outside-handler" not in check_python_str(code)


class TestNoHardcodedDates:
    def test_fires_on_date_literal(self):
        assert "no-hardcoded-dates" in check_python_str('start = "2024-01-01"')

    def test_no_fire_on_constant(self):
        assert "no-hardcoded-dates" not in check_python_str('DEFAULT_START_DATE = "2024-01-01"')


class TestIdempotentWrites:
    def test_fires_on_append_without_delete(self):
        assert "idempotent-writes" in check_python_str('df.to_sql("t", engine, if_exists="append")')


# ══════════════════════════════════════════════════════════════════════════════
#  TERRAFORM RULES
# ══════════════════════════════════════════════════════════════════════════════

class TestRemoteState:
    def test_fires_on_local_backend(self):
        assert "remote-state" in check_terraform_str('terraform {\n  backend "local" {}\n}')

    def test_fires_on_missing_backend(self):
        assert "remote-state" in check_terraform_str('terraform {\n  required_version = ">= 1.0"\n}')

    def test_no_fire_on_s3_backend(self):
        assert "remote-state" not in check_terraform_str('terraform {\n  backend "s3" {\n    bucket = "state"\n  }\n}')


class TestRequiredTags:
    def test_fires_on_resource_without_tags(self):
        tf = 'resource "aws_s3_bucket" "data" {\n  bucket = "my-bucket"\n}'
        assert "required-tags" in check_terraform_str(tf)

    def test_no_fire_with_tags(self):
        tf = 'resource "aws_s3_bucket" "data" {\n  bucket = "my-bucket"\n  tags = {\n    Environment = "prod"\n  }\n}'
        assert "required-tags" not in check_terraform_str(tf)


class TestNoHardcodedValues:
    def test_fires_on_arn(self):
        assert "no-hardcoded-values" in check_terraform_str('role_arn = "arn:aws:iam::123456789012:role/test"')

    def test_fires_on_account_id(self):
        assert "no-hardcoded-values" in check_terraform_str('account_id = "123456789012"')


# ══════════════════════════════════════════════════════════════════════════════
#  S3 / CROSS-CUTTING RULES
# ══════════════════════════════════════════════════════════════════════════════

class TestS3HivePartitions:
    def test_fires_on_flat_s3_path(self):
        assert "s3-hive-partitions" in check_s3_str('path = "s3://bucket/data/2024/01/01/file.parquet"')

    def test_no_fire_on_partitioned_path(self):
        assert "s3-hive-partitions" not in check_s3_str('path = "s3://bucket/data/year=2024/month=01/file.parquet"')


class TestConfigSeparation:
    def test_fires_on_connection_string_outside_config(self):
        assert "config-separation" in check_s3_str('engine = create_engine("postgresql://user:pass@host/db")', filepath="etl/load.py")

    def test_no_fire_in_config_dir(self):
        assert "config-separation" not in check_s3_str('engine = create_engine("postgresql://user:pass@host/db")', filepath="config/database.py")


class TestParquetFormat:
    def test_fires_on_csv_in_staged(self):
        assert "parquet-format" in check_s3_str('df.to_csv("output.csv")', filepath="staged/transform.py")

    def test_no_fire_in_raw(self):
        assert "parquet-format" not in check_s3_str('df.to_csv("output.csv")', filepath="raw/ingest.py")


# ══════════════════════════════════════════════════════════════════════════════
#  SUPPRESSION
# ══════════════════════════════════════════════════════════════════════════════

class TestSuppression:
    def test_python_disable_next_line(self):
        code = "# check-disable-next-line\nprint('hello')"
        assert "no-print-logging" not in check_python_str(code)

    def test_sql_disable_block(self):
        sql = "-- check-disable\nSELECT * FROM users;\n-- check-enable\nSELECT id FROM orders;"
        rules = check_sql_str(sql)
        assert "no-select-star" not in rules


if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])

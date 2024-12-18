# S3 bucket for UI
resource "aws_s3_bucket" "todoui" {
  bucket = var.s3_bucket_name
  force_destroy = true
}

# resource "aws_s3_bucket_ownership_controls" "todoui_ownership_controls" {
#   bucket = aws_s3_bucket.todoui.id
#   rule {
#     object_ownership = "BucketOwnerPreferred"
#   }
# }

resource "aws_s3_bucket_website_configuration" "todoui_website_configuration" {
  bucket = aws_s3_bucket.todoui.id

  index_document {
    suffix = "index.html"
  }
}

# resource "aws_s3_bucket_public_access_block" "todoui_pub_access_block" {
#   bucket = aws_s3_bucket.todoui.id
#
#   block_public_acls       = false
#   block_public_policy     = false
#   ignore_public_acls      = false
#   restrict_public_buckets = false
# }

# resource "aws_s3_bucket_acl" "bucket-acl" {
#   depends_on = [
#     aws_s3_bucket_ownership_controls.todoui_ownership_controls,
#     aws_s3_bucket_public_access_block.todoui_pub_access_block,
#   ]
#
#   bucket = aws_s3_bucket.todoui.id
#   acl    = "private"
# }

data "aws_iam_policy_document" "s3_bucket_policy" {
  depends_on = [ 
    aws_cloudfront_distribution.cloudfront_distrib,  
    aws_s3_bucket.todoui
  ]
  statement {
    sid    = "AllowCloudFrontServicePrincipalReadOnly"
    effect = "Allow"

    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.todoui.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.cloudfront_distrib.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "static_site_bucket_policy" {
  depends_on = [
    aws_cloudfront_distribution.cloudfront_distrib
  ]
  bucket = aws_s3_bucket.todoui.id
  policy = data.aws_iam_policy_document.s3_bucket_policy.json
}

# locals {
#   send_to_s3 = "aws s3 cp ../../frontend/todo_ui/build s3://${aws_s3_bucket.todoui.id}/ --recursive"
# }

# resource "null_resource" "send_s3" {
#   provisioner "local-exec" {
#       command                     = local.send_to_s3
#   }
#   triggers = {
#       "run_at"                    = timestamp()
#   }
#   depends_on                      = [aws_s3_bucket.todoui]
# }
